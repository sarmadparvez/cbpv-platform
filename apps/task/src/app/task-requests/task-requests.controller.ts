import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TaskRequestsService } from './task-requests.service';
import { CreateTaskRequestDto } from './dto/create-task-request.dto';
import { UpdateTaskRequestDto } from './dto/update-task-request.dto';
import { ForbiddenError } from '@casl/ability';
import { Action } from '../iam/policy';
import * as contextService from 'request-context';
import { TaskRequest } from './entities/task-request.entity';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('task-requests')
@Controller('task-requests')
export class TaskRequestsController {
  constructor(private readonly taskRequestsService: TaskRequestsService) {}

  /**
   * Create a new TaskRequest. The user must have Create permission for TaskRequests.
   */
  @ApiBearerAuth()
  @Post()
  create(@Body() createTaskRequestDto: CreateTaskRequestDto) {
    // check if user have permission to create task request
    ForbiddenError.from(contextService.get('userAbility')).throwUnlessCan(
      Action.Create,
      TaskRequest
    );
    return this.taskRequestsService.create(createTaskRequestDto);
  }

  /**
   * Get a list of all TaskRequests. The user must have permission to Read all TaskRequests.
   */
  @ApiBearerAuth()
  @Get()
  findAll() {
    // check if user have permission to list TaskRequests.
    ForbiddenError.from(contextService.get('userAbility')).throwUnlessCan(
      Action.Read,
      new TaskRequest()
    );
    return this.taskRequestsService.findAll();
  }

  @ApiBearerAuth()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskRequestsService.findOne(id);
  }

  @ApiBearerAuth()
  @ApiParam({
    name: 'taskId',
    description: 'Task id for which the user requested.',
  })
  @Get('search-request/:taskId')
  searchRequest(@Param('taskId') taskId: string) {
    return this.taskRequestsService.searchRequest(taskId);
  }

  @ApiBearerAuth()
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTaskRequestDto: UpdateTaskRequestDto
  ) {
    return this.taskRequestsService.update(id, updateTaskRequestDto);
  }

  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskRequestsService.remove(id);
  }
}
