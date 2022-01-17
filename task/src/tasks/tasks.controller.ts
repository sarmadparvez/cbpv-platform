import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  Put,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FindAllTasksDto } from './dto/find-all-tasks.dto';
import { ForbiddenError } from '@casl/ability';
import { Action } from '../iam/policy';
import * as contextService from 'request-context';
import { Task } from './entities/task.entity';
import { Feedback } from '../feedbacks/entities/feedback.entity';
import { BatchCreateImagesDto } from './dto/batch-create-images.dto';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  /**
   * Create a new Task. The user must have Create permission for Tasks.
   * User can only create Tasks for its own Projects.
   */
  @ApiBearerAuth()
  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    // check if user have permission to create Task
    ForbiddenError.from(contextService.get('userAbility')).throwUnlessCan(
      Action.Create,
      Task,
    );
    return this.tasksService.create(createTaskDto);
  }

  /**
   * By default, Task is created as draft. Use this endpoint to Activate the task.
   * Activating a task changes its status to open, and it can no longer be edited.
   *
   * There are certain pre-requisites for activating a Task.
   *
   * 1. The Task must contain Questions
   * 2. The Task must contain crowd selection criteria (Skills and Countries)
   * 3. The Task must be in Draft state
   * 4. The task must contain Pictures, or Iframe Urls or textual description of Idea.
   */
  @ApiBearerAuth()
  @Put(':id/activate')
  activate(@Param('id') id: string) {
    return this.tasksService.activate(id);
  }

  /**
   * Get a list of all Tasks. The user must have permission to Read all Tasks.
   */
  @ApiBearerAuth()
  @Get()
  findAll(@Query() query?: FindAllTasksDto) {
    // check if user have permission to list Tasks
    ForbiddenError.from(contextService.get('userAbility')).throwUnlessCan(
      Action.Read,
      new Task(),
    );
    return this.tasksService.findAll(query);
  }

  /**
   * Get a list of all task iterations for a projectId. The iterations are returned in descending order.
   * The user must have Read permission on the Project and its Task iterations.
   */
  @ApiParam({
    name: 'projectId',
    description: 'The project id to list iterations for',
  })
  @ApiBearerAuth()
  @Get('iterations/:projectId')
  findIterations(@Param('projectId') projectId: string) {
    // check if user have permission to read Tasks
    ForbiddenError.from(contextService.get('userAbility')).throwUnlessCan(
      Action.Read,
      Task,
    );
    return this.tasksService.findIterations(projectId);
  }

  /**
   * Get open tasks for Crowdworker to work on. The calling user must have Create permission for the Feedback,
   * because only those users can see open tasks which have permission to create feedbacks.
   * Only those Tasks will be returned where user have not provided Feedback yet.
   */
  @ApiBearerAuth()
  @Get('open')
  findOpenTasks() {
    // Check if user have permission to create feedback
    ForbiddenError.from(contextService.get('userAbility')).throwUnlessCan(
      Action.Create,
      Feedback,
    );
    return this.tasksService.findOpenTasks();
  }

  /**
   * Get a Task. The calling user must have Read permission the Task either explicitly or implicitly.
   * Explicit Permission: E.g Given by a role e.g developer role
   * Implicit Permission: The task is open for evaluation and its criteria matches calling user profile.
   * and calling user have permission to create Feedback.
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  /**
   * Update a Task. The calling user must have Update permission the Task.
   */
  @ApiBearerAuth()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  /**
   * Delete a Task. The calling user must have Delete permission the Task.
   */
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }

  /**
   * Images are uploaded to cloudinary.com. For uploading an image, a signature is required.
   * This endpoint returns that signature which clients can use to upload images.
   */
  @ApiBearerAuth()
  @Get(':id/imageUploadSignature')
  imageUploadSignature(@Param('id') id: string) {
    return this.tasksService.getImageUploadSignature(id);
  }

  /**
   * Batch create Images
   * The user must have Update permission for Task.
   */
  @ApiBearerAuth()
  @Post(':id/batchCreateImages')
  batchCreateImages(
    @Param('id') id: string,
    @Body() saveImageUrlsDto: BatchCreateImagesDto,
  ) {
    return this.tasksService.batchCreateImages(id, saveImageUrlsDto);
  }

  /**
   * Get list of images for the Task.
   * The caller must have read permission for the Task either explicitly or either implicitly.
   * Explicit Permission: E.g Given by a role e.g developer role
   * Implicit Permission: The task is open for evaluation and its criteria matches calling user profile.
   * and calling user have permission to create Feedback.
   */
  @ApiBearerAuth()
  @ApiQuery({
    name: 'splitNumber',
    required: false,
    description: 'Optional filtering by splitNumber',
    type: 'number',
  })
  @Get(':id/images')
  findAllImages(
    @Param('id') id: string,
    @Query('splitNumber') splitNumber?: number,
  ) {
    return this.tasksService.findAllImages(id, splitNumber);
  }

  /**
   * Delete an Image for Task. The calling user must have Update permission on the Task.
   */
  @ApiBearerAuth()
  @Delete(':id/images/:imageId')
  removeImage(@Param('id') id: string, @Param('imageId') imageId: string) {
    return this.tasksService.removeImage(id, imageId);
  }
}
