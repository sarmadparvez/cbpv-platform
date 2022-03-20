import { Component, NgModule } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { firstValueFrom, ReplaySubject } from 'rxjs';
import {
  Feedback,
  FeedbacksService,
  Task,
  TasksService,
} from '../../../gen/api/task';
import { TaskFeedbackModule } from '../../task/task-feedback/task-feedback.component';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { FlexModule } from '@angular/flex-layout';
import { NgxMaterialRatingModule } from 'ngx-material-rating';
import {
  BatchGetUserInfoDto,
  User,
  UsersService,
} from '../../../gen/api/admin';

@Component({
  selector: 'app-feedback-detail',
  templateUrl: './feedback-detail.component.html',
  styleUrls: ['./feedback-detail.component.scss'],
})
export class FeedbackDetailComponent {
  feedback = new ReplaySubject<Feedback>(1);
  task = new ReplaySubject<Task>(1);
  taskOwner = new ReplaySubject<User>(1);
  constructor(
    private readonly route: ActivatedRoute,
    private readonly feedbackService: FeedbacksService,
    private readonly taskService: TasksService,
    private readonly userService: UsersService,
  ) {
    const feedbackId = this.route.snapshot.paramMap.get('feedbackId');
    if (feedbackId) {
      this.getFeedback(feedbackId);
      this.getUserInfo();
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

  async getUserInfo() {
    const task = await firstValueFrom(this.task);
    const request: BatchGetUserInfoDto = {
      ids: [task.userId],
    };
    const users = await firstValueFrom(this.userService.batchGetInfo(request));
    if (users.length > 0) {
      this.taskOwner.next(users[0]);
    }
  }
}

@NgModule({
  imports: [
    CommonModule,
    TaskFeedbackModule,
    MatCardModule,
    TranslateModule,
    FlexModule,
    NgxMaterialRatingModule,
  ],
  declarations: [FeedbackDetailComponent],
})
export class FeedbackDetailModule {}
