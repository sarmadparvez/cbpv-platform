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

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, Image, Question, Project, TaskRequest]),
    ConfigModule,
    UsersModule,
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
