import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { classToPlain, plainToClass } from 'class-transformer';
import {
  PrototypeFormat,
  Task,
  TaskStatus,
  TestType,
} from './entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, In, Repository } from 'typeorm';
import { Skill } from '../skills/entities/skill.entity';
import { Country } from '../countries/entities/country.entity';
import { FindAllTasksDto } from './dto/find-all-tasks.dto';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { FileUploadSignatureResponseDto } from './dto/file-upload-signature-response.dto';
import { Action, AppAbility } from '../iam/policy';
import { findWithPermissionCheck } from '../iam/utils';
import * as contextService from 'request-context';
import { Project } from '../projects/entities/project.entity';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { Feedback } from '../feedbacks/entities/feedback.entity';
import { BatchCreateImagesDto } from './dto/batch-create-images.dto';
import { Image } from './entities/image.entity';
import cloudinaryConfig from '../config/cloudinary';

cloudinary.config(cloudinaryConfig().cloudinary.config);

@Injectable()
export class TasksService {
  constructor(
    private configService: ConfigService,
    private userService: UsersService,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}
  async create(createTaskDto: CreateTaskDto) {
    // Check if Project of the Task belongs to user.
    const user = contextService.get('user') as User;
    const project = await this.projectRepository.findOneOrFail(
      createTaskDto.projectId,
    );
    if (project.userId !== user.id) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'The project does not belongs to the user.',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    // check if there is already a draft or open Task available, the new Task cannot be created.
    const existingTask = await this.taskRepository.findOne({
      select: ['id'],
      where: {
        status: In([TaskStatus.Open, TaskStatus.Draft]),
        projectId: createTaskDto.projectId,
      },
    });

    if (existingTask) {
      throw new HttpException(
        {
          status: HttpStatus.PRECONDITION_FAILED,
          error:
            'Please close previous Task iteration before starting a new one.',
        },
        HttpStatus.PRECONDITION_FAILED,
      );
    }

    if (createTaskDto.incentive > createTaskDto.budget) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: 'Incentive cannot be greater than total budget.',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const task = taskDtoToEntity(createTaskDto);
    task.userId = user.id;
    if (createTaskDto.skills) {
      // add skills relationship
      task.skills = createTaskDto.skills.map((id) => <Skill>{ id });
    }
    if (createTaskDto.countries) {
      // add countries relationship
      task.countries = createTaskDto.countries.map((id) => <Country>{ id });
    }
    return this.taskRepository.save(task);
  }

  findAll(query?: FindAllTasksDto) {
    const options: FindManyOptions = {
      relations: ['skills', 'countries'],
    };
    if (query && query.projectId) {
      // order by dateCreated to return in the order of iterations
      options.where = { projectId: query.projectId };
      options.order = { dateCreated: 'ASC' };
    }
    return this.taskRepository.find(options);
  }

  async findIterations(projectId: string) {
    // check if user has read permission on the project
    await findWithPermissionCheck(
      projectId,
      Action.Read,
      this.projectRepository,
    );
    return this.taskRepository.find({
      relations: ['skills', 'countries', 'questions'],
      where: {
        projectId,
      },
      order: {
        dateCreated: 'DESC',
      },
    });
  }

  async findOpenTasks() {
    // get current user from the admin service to get details for matching the criteria (Task vs User)
    const user = await this.userService.getUser(contextService.get('user').id);
    const query = this.getTaskMatchingQuery(user);
    // filter out those tasks on which user have already provided feedback
    query.leftJoin(
      'task.feedbacks',
      'feedbacks',
      'feedbacks.userId = :userId',
      {
        userId: user.id,
      },
    );
    query.andWhere('feedbacks.taskId IS NULL AND task.status = :taskStatus', {
      taskStatus: TaskStatus.Open,
    });
    return query.getMany();
  }

  /**
   * Given a user, find the matching Tasks for it
   * @param user The user to find Tasks for
   * @private
   */
  private getTaskMatchingQuery(user: User) {
    const birthDate = new Date(user.birthDate);
    const now = new Date();
    let age = now.getFullYear() - birthDate.getFullYear();
    const month = now.getMonth() - birthDate.getMonth();
    if (month < 0 || (month == 0 && now.getDate() < birthDate.getDate())) {
      age--;
    }
    return this.taskRepository
      .createQueryBuilder('task')
      .innerJoinAndSelect(
        'task.skills',
        'skills',
        'skills.id IN (:...skills) ',
        {
          skills: user.skills.map((skill) => skill.id),
        },
      )
      .innerJoinAndSelect(
        'task.countries',
        'countries',
        'countries.id = :countryId',
        {
          countryId: user.country.id,
        },
      )
      .where(
        'task.maxExperience >= :userExperience AND task.minExperience <= :userExperience ' +
          'AND task.maxAge >= :userAge AND task.minAge <= :userAge',
        {
          userExperience: user.experience,
          userAge: age,
        },
      );
  }

  async findOne(id: string) {
    const task = await this.taskRepository.findOneOrFail(id, {
      relations: ['skills', 'countries', 'questions'],
    });
    const ability = contextService.get('userAbility') as AppAbility;
    if (ability.can(Action.Read, task)) {
      // user have explicit permission to Read the task
      return task;
    }
    // Check if user implicitly have permission to Read the Task
    // i.e if user have permission to create Feedback for this Task
    // first fetch the user from admin service
    if (ability.can(Action.Create, Feedback)) {
      const user = await this.userService.getUser(
        contextService.get('user').id,
      );
      const query = this.getTaskMatchingQuery(user);
      query.andWhere('task.id = :taskId', {
        taskId: id,
      });
      const taskMatchedCount = await query.getCount();
      if (taskMatchedCount > 0) {
        return task;
      }
    }
    // User does not have access to this Task
    throw new HttpException(
      {
        status: HttpStatus.FORBIDDEN,
        error: 'You do not have permission for this Task.',
      },
      HttpStatus.FORBIDDEN,
    );
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    // check if user have permission to update Task
    // a user can only update task which belongs to him (task.userId = user.id)
    const existingTask = await findWithPermissionCheck(
      id,
      Action.Update,
      this.taskRepository,
    );

    // task can only be updated if it is draft state
    this.draftCheck(existingTask);

    const task = taskDtoToEntity(updateTaskDto);
    if (updateTaskDto.skills) {
      // update skills relationship
      task.skills = updateTaskDto.skills.map((id) => <Skill>{ id });
    }
    if (updateTaskDto.countries) {
      // update countries relationship
      task.countries = updateTaskDto.countries.map((id) => <Country>{ id });
    }
    task.id = id;
    // using save instead of update here to also add/remove the relationships
    await this.taskRepository.save(task);
    return this.taskRepository.findOne(id);
  }

  async remove(id: string) {
    // check if user have permission to delete Task
    // a user can only delete task which belongs to him (task.userId = user.id)
    await findWithPermissionCheck(id, Action.Delete, this.taskRepository);
    return this.taskRepository.delete(id);
  }

  async activate(id: string) {
    // check if user have permission to update Task
    // a user can only update/activate task which belongs to him (task.userId = user.id)
    const task = await findWithPermissionCheck(
      id,
      Action.Update,
      this.taskRepository,
      {
        relations: ['images', 'skills', 'countries', 'questions'],
      },
    );
    const messages: string[] = [];
    // validate task first
    if (task.status !== TaskStatus.Draft) {
      messages.push('Task can only be activated when in draft state.');
    }
    if (!task.incentive || task.incentive < 1) {
      messages.push('Please set the incentive.');
    }
    if (!task.budget || task.budget < 1) {
      messages.push('Please set the budget.');
    }
    if (task.incentive > task.budget) {
      messages.push('Incentive cannot be greater than budget');
    }
    if (task.countries.length === 0) {
      messages.push(
        'Please provide a country for matching the Task with Crowdworkers.',
      );
    }
    if (task.skills.length === 0) {
      messages.push(
        'Please provide skills for matching the Task with Crowdworkers.',
      );
    }
    if (task.questions.length === 0) {
      messages.push('Please provide questions.');
    }
    if (task.minExperience) {
      messages.push(
        'Please provide a country for matching the Task with Crowdworkers.',
      );
    }
    if (this.isIframeFormat(task)) {
      if (
        (this.isBasicTest(task) && !task.iframeUrl1) ||
        (this.isSplitTest(task) && (!task.iframeUrl1 || !task.iframeUrl2))
      ) {
        messages.push('Task cannot be activated without iframe url.');
      }
    } else if (this.isImageFormat(task)) {
      if (this.isBasicTest(task) && task.images.length === 0) {
        messages.push('At-least one image is required for the basic test.');
      } else if (this.isSplitTest(task) && task.images.length < 2) {
        messages.push('At-least two images are required for a split test.');
      }
    } else if (this.isTextFormat(task)) {
      if (
        (this.isBasicTest(task) && !task.textualDescription1) ||
        (this.isSplitTest(task) &&
          (!task.textualDescription1 || !task.textualDescription2))
      ) {
        messages.push('Task cannot be activated without textual description.');
      }
    } else {
      messages.push('The Prototype format must be set');
    }
    if (messages.length > 0) {
      throw new HttpException(
        {
          status: HttpStatus.PRECONDITION_FAILED,
          error: messages,
        },
        HttpStatus.PRECONDITION_FAILED,
      );
    }
    // activate the task after validation
    task.status = TaskStatus.Open;
    return this.taskRepository.save(task);
  }

  private isBasicTest(task: Task) {
    return task.testType === TestType.Basic;
  }

  private isSplitTest(task: Task) {
    return task.testType === TestType.Split;
  }

  private isImageFormat(task: Task) {
    return task.prototypeFormat === PrototypeFormat.Image;
  }

  private isIframeFormat(task: Task) {
    return task.prototypeFormat === PrototypeFormat.Iframe;
  }

  private isTextFormat(task: Task) {
    return task.prototypeFormat === PrototypeFormat.Text;
  }

  getImageUploadSignature(id: string) {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const cloudinaryConfig = this.configService.get('cloudinary');
    const folder = `${cloudinaryConfig.imagesFolder}/${id}`;
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder,
      },
      cloudinaryConfig.config.api_secret,
    );
    return plainToClass(FileUploadSignatureResponseDto, {
      apiKey: cloudinaryConfig.config.api_key,
      uploadUrl: cloudinaryConfig.apiUrl
        .replace(':cloud_name', cloudinaryConfig.config.cloud_name)
        .replace(':action', 'upload'),
      signature,
      timestamp,
      folder,
    });
  }

  async batchCreateImages(
    taskId: string,
    batchCreateImagesDto: BatchCreateImagesDto,
  ) {
    // check if user have permission to update Task
    // a user can only update task which belongs to him (task.userId = user.id)
    const existingTask = await findWithPermissionCheck(
      taskId,
      Action.Update,
      this.taskRepository,
    );
    // Images can only be added if the task is in draft state
    this.draftCheck(existingTask);

    batchCreateImagesDto.images.forEach((image) => (image.taskId = taskId));
    // insert images
    return this.taskRepository.manager.insert(
      Image,
      batchCreateImagesDto.images,
    );
  }

  private draftCheck(task: Task) {
    if (task.status !== TaskStatus.Draft) {
      throw new HttpException(
        {
          status: HttpStatus.PRECONDITION_FAILED,
          error: 'Task is not in draft state.',
        },
        HttpStatus.PRECONDITION_FAILED,
      );
    }
  }

  async findAllImages(taskId: string, splitNumber: number) {
    // check if user have permission to Read Task
    const task = await findWithPermissionCheck(
      taskId,
      Action.Read,
      this.taskRepository,
    );
    const where = {
      taskId,
    };
    if (splitNumber) {
      where['splitNumber'] = splitNumber;
    }
    return this.taskRepository.manager.find(Image, {
      where,
    });
  }

  async removeImage(taskId: string, imageId: string) {
    // check if user have permission to Update Task
    const task = await findWithPermissionCheck(
      taskId,
      Action.Update,
      this.taskRepository,
    );
    // check if image belongs to the taskId
    const image = await this.taskRepository.manager.findOneOrFail(Image, {
      where: {
        id: imageId,
        taskId,
      },
    });
    // delete image from cloud storage
    try {
      const response = await cloudinary.uploader.destroy(image.cloudId);
      // delete image from database
      if (response['result'] && response['result'] === 'ok') {
        await this.taskRepository.manager.delete(Image, image.id);
      } else {
        Logger.error(response);
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            error: response.result,
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    } catch (err) {
      Logger.error(
        `failed deleting image from the cloudinary with public id ${image.cloudId} and imageId ${image.id} `,
      );
      throw err;
    }
  }
}

function taskDtoToEntity(dto: CreateTaskDto | UpdateTaskDto): Task {
  const data = classToPlain(dto);
  return plainToClass(Task, data);
}
