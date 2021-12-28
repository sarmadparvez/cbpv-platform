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
import { ApiTags } from '@nestjs/swagger';
import { FindAllTaskDto } from './dto/find-all-task-dto';

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
   */
  @Get()
  findAll(@Query() query?: FindAllTaskDto) {
    return this.tasksService.findAll(query);
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

  /**
   * Images are uploaded to cloudinary.com. For uploading an image, a signature is required.
   * This endpoint returns that signature which clients can use to upload images.
   */
  @Get(':id/imageUploadSignature')
  imageUploadSignature(@Param('id') id: string) {
    return this.tasksService.getImageUploadSignature(id);
  }
}
