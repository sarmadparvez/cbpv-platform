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

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}
  create(createTaskDto: CreateTaskDto) {
    const task = taskDtoEntity(createTaskDto);
    // ToDo: hardcoded for now, later use current user id
    task.userId = '6e6ff5d0-1807-4929-bcc4-b0ae88d825f1';
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

  findAll(projectId?: string) {
    const options: FindManyOptions = {
      relations: ['skills', 'countries'],
    };
    if (projectId) {
      // order by dateCreated to return in the order of iterations
      options.where = { projectId };
      options.order = { dateCreated: 'ASC' };
    }
    return this.taskRepository.find(options);
  }

  findOne(id: string) {
    return this.taskRepository.findOneOrFail(id, {
      relations: ['skills', 'countries', 'questions'],
    });
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    // first check if the record exist in database because we use .save here and
    // save will create new if it not exists, but we don't want to create new here
    // as this is an update call.
    await this.taskRepository.findOneOrFail(id, { select: ['id'] });

    const task = taskDtoEntity(updateTaskDto);
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

  remove(id: string) {
    return this.taskRepository.delete(id);
  }

  async activate(id: string) {
    const task = await this.taskRepository.findOneOrFail(id, {
      relations: ['images'],
    });
    const messages: string[] = [];
    // validate task first
    if (task.status !== TaskStatus.DRAFT) {
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
    }
    if (messages.length > 0) {
      throw new HttpException(
        {
          status: HttpStatus.PRECONDITION_FAILED,
          error: messages,
        },
        HttpStatus.FORBIDDEN,
      );
    }
    // activate the task after validation
    task.status = TaskStatus.OPEN;
    return this.taskRepository.save(task);
  }

  private isBasicTest(task: Task) {
    return task.testType === TestType.BASIC;
  }

  private isSplitTest(task: Task) {
    return task.testType === TestType.SPLIT;
  }

  private isImageFormat(task: Task) {
    return task.prototypeFormat === PrototypeFormat.IMAGE;
  }

  private isIframeFormat(task: Task) {
    return task.prototypeFormat === PrototypeFormat.IFRAME;
  }
}

function taskDtoEntity(dto: CreateTaskDto | UpdateTaskDto): Task {
  const data = classToPlain(dto);
  return plainToClass(Task, data);
}
