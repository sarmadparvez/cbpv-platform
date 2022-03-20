import { Component, Input, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom, ReplaySubject } from 'rxjs';
import {
  Question,
  QuestionAnswerStats,
  Task,
  TasksService,
} from '../../../gen/api/task';
import QuestionTypeEnum = QuestionAnswerStats.QuestionTypeEnum;
import { ThumbsRatingVisualizationModule } from '../thumbs-rating-visualization/thumbs-rating-visualization.component';
import { RadioFeedbackVisualizationModule } from '../radio-feedback-visualization/radio-feedback-visualization.component';
import { StarRatingVisualizationModule } from '../star-rating-visualization/star-rating-visualization.component';

export interface QuestionStats {
  question: Question;
  stats: QuestionAnswerStats[];
}

@Component({
  selector: 'app-feedback-visualization',
  templateUrl: './feedback-visualization.component.html',
  styleUrls: ['./feedback-visualization.component.scss'],
})
export class FeedbackVisualizationComponent implements OnInit {
  @Input() task = new ReplaySubject<Task>(1);

  questionStats: QuestionStats[] = [];
  QuestionTypeEnum = QuestionTypeEnum;

  constructor(private readonly taskService: TasksService) {
  }

  async ngOnInit() {
    this.task.subscribe(task => {
      this.getFeedbackStats(task);
    });
  }

  private async getFeedbackStats(task: Task) {
    const response = await firstValueFrom(
      this.taskService.feedbackStats(task.id),
    );
    this.processStats(task, response.stats);
  }

  private processStats(task: Task, stats: QuestionAnswerStats[]) {
    this.questionStats = [];
    task.questions.forEach(question => {
      const questionStats = stats.filter(s => s.questionId === question.id);
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
  ],
  declarations: [FeedbackVisualizationComponent],
  exports: [FeedbackVisualizationComponent],
})
export class FeedbackVisualizationModule {}
