import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Image } from './entities/image.entity';
import { Question } from './entities/question.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Task, Image, Question]), ConfigModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
