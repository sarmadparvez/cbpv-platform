import { Component, Input, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom, Observable, ReplaySubject } from 'rxjs';
import {
  FeedbackStatsResponseDto,
  Question,
  QuestionAnswerStats,
  Task,
  TasksService,
  UpdateTaskDto,
} from '../../../gen/api/task';
import QuestionTypeEnum = QuestionAnswerStats.QuestionTypeEnum;
import { ThumbsRatingVisualizationModule } from '../thumbs-rating-visualization/thumbs-rating-visualization.component';
import { RadioFeedbackVisualizationModule } from '../radio-feedback-visualization/radio-feedback-visualization.component';
import { StarRatingVisualizationModule } from '../star-rating-visualization/star-rating-visualization.component';
import { SubscriptionComponent } from '../../common/subscription.component';
import TestTypeEnum = UpdateTaskDto.TestTypeEnum;
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';

export interface QuestionStats {
  question: Question;
  stats: QuestionAnswerStats[];
}

@Component({
  selector: 'app-feedback-visualization',
  templateUrl: './feedback-visualization.component.html',
  styleUrls: ['./feedback-visualization.component.scss'],
})
export class FeedbackVisualizationComponent
  extends SubscriptionComponent
  implements OnInit
{
  @Input() task = new ReplaySubject<Task>(1);

  questionStats: QuestionStats[] = [];
  QuestionTypeEnum = QuestionTypeEnum;
  TestTypeEnum = Task.TestTypeEnum;
  prototypeNumber = 1;

  constructor(private readonly taskService: TasksService) {
    super();
  }

  async ngOnInit() {
    this.subscriptions.add(
      this.task.subscribe(() => {
        this.getFeedbackStats();
      })
    );
  }

  async loadPrototypeStats(event: MatSelectChange) {
    this.prototypeNumber = event.value;
    this.getFeedbackStats();
  }

  private async getFeedbackStats() {
    const task = await firstValueFrom(this.task);
    let request: Observable<FeedbackStatsResponseDto>;
    if (task.testType === TestTypeEnum.Split) {
      request = this.taskService.feedbackStats(task.id, this.prototypeNumber);
    } else {
      request = this.taskService.feedbackStats(task.id);
    }
    const response = await firstValueFrom(request);
    this.processStats(task, response.stats);
  }

  private processStats(task: Task, stats: QuestionAnswerStats[]) {
    this.questionStats = [];
    task.questions.forEach((question) => {
      const questionStats = stats.filter((s) => s.questionId === question.id);
      if (questionStats.length > 0) {
        this.questionStats.push({
          question,
          stats: questionStats,
        });
      }
    });
  }
}
@NgModule({
  imports: [
    CommonModule,
    ThumbsRatingVisualizationModule,
    RadioFeedbackVisualizationModule,
    StarRatingVisualizationModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  declarations: [FeedbackVisualizationComponent],
  exports: [FeedbackVisualizationComponent],
})
export class FeedbackVisualizationModule {}
