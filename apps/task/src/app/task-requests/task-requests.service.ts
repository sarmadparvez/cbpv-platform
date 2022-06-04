import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTaskRequestDto } from './dto/create-task-request.dto';
import { UpdateTaskRequestDto } from './dto/update-task-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskRequest, TaskRequestStatus } from './entities/task-request.entity';
import { classToPlain, plainToClass } from 'class-transformer';
import * as contextService from 'request-context';
import { findWithPermissionCheck } from '../iam/utils';
import { Action, AppAbility } from '../iam/policy';
import { Task } from '../tasks/entities/task.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TaskRequestsService {
  constructor(
    @InjectRepository(TaskRequest)
    private taskRequestRepository: Repository<TaskRequest>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>
  ) {}

  async create(createTaskRequestDto: CreateTaskRequestDto) {
    const user = contextService.get('user') as User;
    // Check if a TaskRequest is already created by this user, for this task.
    const existingTaskRequest = await this.taskRequestRepository.findOne({
      select: ['id'],
      where: {
        userId: user.id,
        taskId: createTaskRequestDto.taskId,
      },
    });
    if (existingTaskRequest) {
      throw new HttpException(
        {
          status: HttpStatus.PRECONDITION_FAILED,
          error: 'This task is already requested by you.',
        },
        HttpStatus.PRECONDITION_FAILED
      );
    }

    const taskRequest = taskRequestDtoEntity(createTaskRequestDto);
    taskRequest.userId = contextService.get('user')?.id;
    taskRequest.requestStatus = TaskRequestStatus.Requested;
    return this.taskRequestRepository.save(taskRequest);
  }

  findAll() {
    return this.taskRequestRepository.findOne();
  }

  async findOne(id: string) {
    const taskRequest = await this.taskRequestRepository.findOneOrFail(id);
    const ability = contextService.get('userAbility') as AppAbility;
    if (!ability.can(Action.Read, taskRequest)) {
      // User don't have explicit permission to read TaskRequest.
      // Check if user have implicit permission. An Implicit permission is granted, if the
      // task related to the TaskRequest is owned by user.
      await findWithPermissionCheck(
        taskRequest.taskId,
        Action.Update,
        this.taskRepository
      );
    }
    return taskRequest;
  }

  async update(id: string, updateTaskRequestDto: UpdateTaskRequestDto) {
    const existingTaskRequest = await this.taskRequestRepository.findOneOrFail(
      id
    );

    const ability = contextService.get('userAbility') as AppAbility;
    if (!ability.can(Action.Update, existingTaskRequest)) {
      // User don't have explicit permission to update TaskRequest.
      // Check if user have implicit permission. An Implicit permission is granted, if the
      // task related to the TaskRequest is owned by user.
      await findWithPermissionCheck(
        existingTaskRequest.taskId,
        Action.Update,
        this.taskRepository
      );
    }

    const taskRequest = taskRequestDtoEntity(updateTaskRequestDto);
    await this.taskRequestRepository.update(id, taskRequest);
    return this.taskRequestRepository.findOne(id);
  }

  async remove(id: string) {
    await findWithPermissionCheck(
      id,
      Action.Delete,
      this.taskRequestRepository
    );
    return this.taskRequestRepository.delete(id);
  }

  async searchRequest(taskId: string) {
    const taskRequest = await this.taskRequestRepository.findOneOrFail({
      where: {
        taskId,
        userId: contextService.get('user').id,
      },
    });
    const ability = contextService.get('userAbility') as AppAbility;
    if (!ability.can(Action.Read, taskRequest)) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: "You do not have access to this Task's request.",
        },
        HttpStatus.FORBIDDEN
      );
    }
    return taskRequest;
  }

  async isTaskRequestAccepted(taskId: string) {
    const taskRequest = await this.taskRequestRepository.findOneOrFail({
      where: {
        taskId,
        userId: contextService.get('user')?.id,
      },
    });
    return taskRequest.requestStatus === TaskRequestStatus.Accepted;
  }
}

function taskRequestDtoEntity(
  dto: CreateTaskRequestDto | UpdateTaskRequestDto
): TaskRequest {
  const data = classToPlain(dto);
  return plainToClass(TaskRequest, data);
}
