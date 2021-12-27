import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  /**
   * Create a new Task.
   */
  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  /**
   * By default, Task is created as draft. Use this endpoint to Activate the task.
   * Activating a task changes its status to open, and it can no longer be edited.
   */
  @Patch(':id/activate')
  activate(@Param('id') id: string) {
    return this.tasksService.activate(id);
  }

  /**
   * Returns the task list.
   * @param projectId Filter by project id.
   */
  @ApiQuery({
    name: 'projectId',
    required: false,
    description:
      'When this parameter is provided, the tasks are ordered by dateCreated in ascending to match the iteration order.',
  })
  @Get()
  findAll(@Query('projectId') projectId?: string) {
    return this.tasksService.findAll(projectId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }
}
