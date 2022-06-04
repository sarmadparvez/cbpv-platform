import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Image } from './entities/image.entity';
import { Question } from './entities/question.entity';
import { ConfigModule } from '@nestjs/config';
import { Project } from '../projects/entities/project.entity';
import { UsersModule } from '../users/users.module';
import { TaskRequest } from '../task-requests/entities/task-request.entity';
import { SplitTestCache } from './entities/split-test-cache';
import { TaskRequestsModule } from '../task-requests/task-requests.module';
import { Feedback } from '../feedbacks/entities/feedback.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Task,
      Image,
      Question,
      Project,
      TaskRequest,
      SplitTestCache,
      Feedback,
    ]),
    ConfigModule,
    UsersModule,
    TaskRequestsModule,
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
