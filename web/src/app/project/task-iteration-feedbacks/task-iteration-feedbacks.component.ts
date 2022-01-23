import { Component, Input, NgModule, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { firstValueFrom, ReplaySubject } from 'rxjs';
import { Task } from 'gen/api/task/model/task';
import { NoDataModule } from '../../template/no-data/no-data.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import {
  Feedback,
  FeedbacksService,
  RateFeedbackDto,
} from '../../../../gen/api/task';
import { MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FlexModule } from '@angular/flex-layout';
import { BasicTaskDetailModule } from '../../task/basic-task-detail/basic-task-detail.component';
import {
  BatchGetUserInfoDto,
  User,
  UsersService,
} from '../../../../gen/api/admin';
import { MatDialog } from '@angular/material/dialog';
import {
  TaskIterationFeedbackPreviewComponent,
  TaskFeedbackPreviewDialogData,
} from '../task-iteration-feedback-preview/task-iteration-feedback-preview.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReportMisuseComponent } from '../report-misuse/report-misuse.component';
import {
  RatingDialogComponent,
  RatingDialogData,
} from '../../template/rating-dialog/rating-dialog.component';
import PaymentStatusEnum = Feedback.PaymentStatusEnum;

@Component({
  selector: 'app-task-iteration-feedbacks',
  templateUrl: './task-iteration-feedbacks.component.html',
  styleUrls: ['./task-iteration-feedbacks.component.scss'],
})
export class TaskIterationFeedbacksComponent implements OnInit {
  @Input() task = new ReplaySubject<Task>(1);
  PaymentStatusEnum = PaymentStatusEnum;
  dataSource: MatTableDataSource<Feedback>;
  displayedColumns: string[] = [
    'user',
    'comment',
    'dateCreated',
    'paymentStatus',
    'feedbackRating',
    'taskRating',
    'options',
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  userMap: { [key: string]: User } = {};

  constructor(
    private readonly feedbackService: FeedbacksService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly userService: UsersService,
    private readonly dialog: MatDialog,
    private readonly translateService: TranslateService,
    private readonly snackbar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.task.subscribe(task => {
      if (task) {
        this.findFeedbacks(task.id);
      }
    });
  }

  async findFeedbacks(taskId: string) {
    const feedbacks = await firstValueFrom(
      this.feedbackService.findFeedbacks(taskId),
    );
    this.getUsersForFeedbacks(feedbacks);
    this.dataSource = new MatTableDataSource(feedbacks);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  async getUsersForFeedbacks(feedbacks: Feedback[]) {
    const ids = feedbacks.map(f => f.userId);
    if (ids.length > 0) {
      const request: BatchGetUserInfoDto = {
        ids,
      };
      const users = await firstValueFrom(
        this.userService.batchGetInfo(request),
      );
      users.forEach(user => (this.userMap[user.id] = user));
    }
  }

  async openFeedback(feedbackId: string) {
    const task = await firstValueFrom(this.task);
    const feedback = await firstValueFrom(
      this.feedbackService.findOne(feedbackId),
    );

    this.dialog.open(TaskIterationFeedbackPreviewComponent, {
      data: <TaskFeedbackPreviewDialogData>{
        task,
        feedback,
        user: this.userMap[feedback.userId],
      },
      disableClose: true,
      autoFocus: 'dialog',
      width: '75vw',
    });
  }

  async releasePayment(feedbackId: string) {
    let message = 'notification.paymentReleased';
    try {
      await firstValueFrom(this.feedbackService.releasePayment(feedbackId));
      const feedback = this.dataSource.data.find(f => f.id === feedbackId);
      feedback.paymentStatus = PaymentStatusEnum.Completed;
    } catch (err) {
      message = 'error.paymentRelease';
      console.log('failed releasing payment for the feedback ', err);
    } finally {
      this.snackbar.open(this.translateService.instant(message), '', {
        duration: 5000,
      });
    }
  }

  report(feedbackId: string) {
    this.dialog.open(ReportMisuseComponent, {
      width: '50vw',
      disableClose: true,
    });
  }

  rateFeedback(feedback: Feedback) {
    this.dialog
      .open(RatingDialogComponent, {
        width: '50vw',
        disableClose: true,
        autoFocus: 'dialog',
        data: <RatingDialogData>{
          title: this.translateService.instant('name.rateFeedback'),
          note: this.translateService.instant('note.rateFeedback'),
          rating: feedback.feedbackRating,
          ratingComment: feedback.feedbackRatingComment,
        },
      })
      .afterClosed()
      .subscribe(async (data: RatingDialogData) => {
        if (data) {
          let message = '';
          try {
            const request: RateFeedbackDto = {
              feedbackRating: data.rating,
              feedbackRatingComment: data.ratingComment,
            };
            await firstValueFrom(
              this.feedbackService.rateFeedback(feedback.id, request),
            );
            feedback.feedbackRating = data.rating;
            feedback.feedbackRatingComment = data.ratingComment;
            message = this.translateService.instant(
              'notification.rateFeedback',
            );
          } catch (err) {
            message = this.translateService.instant('error.save');
            console.log('unable to save feedback rating ', err);
          } finally {
            this.snackbar.open(message, '', { duration: 5000 });
          }
        }
      });
  }
}

@NgModule({
  imports: [
    CommonModule,
    NoDataModule,
    MatTableModule,
    TranslateModule,
    MatTooltipModule,
    MatMenuModule,
    MatIconModule,
    MatPaginatorModule,
    MatButtonModule,
    MatCardModule,
    FlexModule,
    BasicTaskDetailModule,
  ],
  declarations: [TaskIterationFeedbacksComponent],
  exports: [TaskIterationFeedbacksComponent],
})
export class TaskFeedbacksModule {}
