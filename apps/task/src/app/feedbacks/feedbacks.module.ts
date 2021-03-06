import { Module } from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import { FeedbacksController } from './feedbacks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feedback } from './entities/feedback.entity';
import { Answer } from './entities/answer.entity';
import { Task } from '../tasks/entities/task.entity';
import { SplitTestCache } from '../tasks/entities/split-test-cache';

@Module({
  imports: [TypeOrmModule.forFeature([Feedback, Answer, Task, SplitTestCache])],
  controllers: [FeedbacksController],
  providers: [FeedbacksService],
})
export class FeedbacksModule {}
