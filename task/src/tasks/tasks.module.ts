import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Image } from './entities/image.entity';
import { Question } from './entities/question.entity';
import { ConfigModule } from '@nestjs/config';
import { Project } from '../projects/entities/project.entity';
import { HttpModule } from '@nestjs/axios';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, Image, Question, Project]),
    ConfigModule,
    UsersModule,
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
