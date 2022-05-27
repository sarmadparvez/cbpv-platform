import { Module } from '@nestjs/common';
import { TaskRequestsService } from './task-requests.service';
import { TaskRequestsController } from './task-requests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TaskRequest } from './entities/task-request.entity';
import { Task } from '../tasks/entities/task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TaskRequest, Task])],
  controllers: [TaskRequestsController],
  providers: [TaskRequestsService],
  exports: [TaskRequestsService],
})
export class TaskRequestsModule {}
