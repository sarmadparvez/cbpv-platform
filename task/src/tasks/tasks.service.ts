import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
import { FindManyOptions, Repository } from 'typeorm';
import { Skill } from '../skills/entities/skill.entity';
import { Country } from '../countries/entities/country.entity';
import { FindAllTaskDto } from './dto/find-all-task-dto';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { FileUploadSignatureResponseDto } from './dto/file-upload-signature-response.dto';
import { Action } from '../iam/policy';
import { findWithPermissionCheck } from '../iam/utils';
import * as contextService from 'request-context';
import { Project } from '../projects/entities/project.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TasksService {
  constructor(
    private configService: ConfigService,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}
  async create(createTaskDto: CreateTaskDto) {
    // Check if Project of the Task belongs to user.
    const user = contextService.get('user')?.id as User;
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

  findAll(query?: FindAllTaskDto) {
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
    return this.findAll({
      projectId,
    });
  }

  findOne(id: string) {
    return findWithPermissionCheck(id, Action.Read, this.taskRepository, {
      relations: ['skills', 'countries', 'questions'],
    });
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
    if (existingTask.status !== TaskStatus.Draft) {
      throw new HttpException(
        {
          status: HttpStatus.PRECONDITION_FAILED,
          error: 'Task is not in draft state.',
        },
        HttpStatus.PRECONDITION_FAILED,
      );
    }

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
        relations: ['images'],
      },
    );
    const messages: string[] = [];
    // validate task first
    if (task.status !== TaskStatus.Draft) {
      messages.push('Task can only be activated when in draft state');
    }
    if (this.isIframeFormat(task)) {
      if (
        (this.isBasicTest(task) && !task.iframeUrl1) ||
        (this.isSplitTest(task) && (!task.iframeUrl1 || !task.iframeUrl2))
      ) {
        messages.push('Task cannot be activated without iframe url');
      }
    } else if (this.isImageFormat(task)) {
      if (this.isBasicTest(task) && task.images.length === 0) {
        messages.push('At-least one image is required for the basic test');
      } else if (this.isSplitTest(task) && task.images.length < 2) {
        messages.push('At-least two images are required for a split test');
      }
    } else if (this.isTextFormat(task)) {
      if (
        (this.isBasicTest(task) && !task.textualDescription1) ||
        (this.isSplitTest(task) &&
          (!task.textualDescription1 || !task.textualDescription2))
      ) {
        messages.push('Task cannot be activated without textual description');
      }
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
      cloudinaryConfig.apiSecret,
    );
    return plainToClass(FileUploadSignatureResponseDto, {
      signature,
      timestamp,
      folder,
    });
  }
}

function taskDtoToEntity(dto: CreateTaskDto | UpdateTaskDto): Task {
  const data = classToPlain(dto);
  return plainToClass(Task, data);
}
