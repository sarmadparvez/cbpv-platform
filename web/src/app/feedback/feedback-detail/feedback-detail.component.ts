import { Component, NgModule } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { firstValueFrom, ReplaySubject } from 'rxjs';
import {
  Feedback,
  FeedbacksService,
  Task,
  TasksService,
} from '../../../../gen/api/task';
import { TaskFeedbackModule } from '../../task/task-feedback/task-feedback.component';

@Component({
  selector: 'app-feedback-detail',
  templateUrl: './feedback-detail.component.html',
  styleUrls: ['./feedback-detail.component.scss'],
})
export class FeedbackDetailComponent {
  feedback = new ReplaySubject<Feedback>(1);
  task = new ReplaySubject<Task>(1);
  constructor(
    private readonly route: ActivatedRoute,
    private readonly feedbackService: FeedbacksService,
    private readonly taskService: TasksService,
  ) {
    const feedbackId = this.route.snapshot.paramMap.get('feedbackId');
    if (feedbackId) {
      this.getFeedback(feedbackId);
    }
  }

  async getFeedback(id: string) {
    const feedback = await firstValueFrom(this.feedbackService.findOne(id));
    this.feedback.next(feedback);
    if (feedback.taskId) {
      this.getTask(feedback.taskId);
    }
  }

  async getTask(taskId: string) {
    const task = await firstValueFrom(this.taskService.findOne(taskId));
    this.task.next(task);
  }
}

@NgModule({
  imports: [CommonModule, TaskFeedbackModule],
  declarations: [FeedbackDetailComponent],
})
export class FeedbackDetailModule {}
