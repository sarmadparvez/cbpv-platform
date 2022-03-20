import { Component, NgModule, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  Feedback,
  FeedbacksService,
  RateTaskDto,
} from '../../../../gen/api/task';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NoDataModule } from '../../template/no-data/no-data.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import PaymentStatusEnum = Feedback.PaymentStatusEnum;
import {
  RatingDialogComponent,
  RatingDialogData,
} from '../../template/rating-dialog/rating-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserMap, UserService } from '../../user/user.service';
import { RolePipeModule } from '../../iam/role.pipe';
import { Action, User } from '../../../../gen/api/admin';
import { PermissionsService } from '../../iam/permission.service';
import ActionEnum = Action.ActionEnum;
import { PermissionPipeModule } from '../../iam/permission.pipe';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogData,
} from '../../template/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-feedbacks',
  templateUrl: './feedbacks.component.html',
  styleUrls: ['./feedbacks.component.scss'],
  providers: [UserService],
})
export class FeedbacksComponent implements OnInit {
  dataSource: MatTableDataSource<Feedback> = new MatTableDataSource<Feedback>(
    [],
  );
  displayedColumns: string[] = [
    'task',
    'prototypeFormat',
    'comment',
    'dateCreated',
    'paymentStatus',
    'incentive',
    'feedbackRating',
    'taskRating',
    'taskUser',
    'options',
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  PaymentStatus = PaymentStatusEnum;
  userMap: UserMap = {};
  RolesEnum = User.RolesEnum;
  Action = ActionEnum;

  constructor(
    private readonly feedbackService: FeedbacksService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly dialog: MatDialog,
    private readonly translateService: TranslateService,
    private readonly snackbar: MatSnackBar,
    private readonly userService: UserService,
    private readonly permService: PermissionsService,
    private readonly snackBar: MatSnackBar,
  ) {
    this.setColumns();
  }

  async setColumns() {
    const ability = await firstValueFrom(this.permService.userAbility);
    if (ability.can(Action.ActionEnum.Manage, 'all')) {
      // Insert feedback provider name in the start
      this.displayedColumns.splice(0, 0, 'feedbackUser', 'feedbackUsername');
      // Insert task owner username at the end.
      this.displayedColumns.splice(
        this.displayedColumns.length - 1,
        0,
        'taskUsername',
      );
    }
  }

  async findFeedbacks() {
    const ability = await firstValueFrom(this.permService.userAbility);
    let feedbacks: Feedback[];
    if (ability.can(Action.ActionEnum.Manage, 'all')) {
      // user can see all feedbacks
      feedbacks = await firstValueFrom(this.feedbackService.findAll());
    } else {
      // user can only see its own feedbacks
      feedbacks = await firstValueFrom(this.feedbackService.searchAll());
    }
    this.getUsers(feedbacks);
    this.dataSource = new MatTableDataSource(feedbacks);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  openFeedback($event: MouseEvent, feedback: string) {
    event.preventDefault();
    this.router.navigate([feedback], {
      relativeTo: this.route,
    });
  }

  async getUsers(feedbacks: Feedback[]) {
    let taskUserIds = feedbacks.map(f => f.task.userId);
    // if user have permission to see all feedbacks, also get feedback provider
    const ability = await firstValueFrom(this.permService.userAbility);
    if (ability.can(Action.ActionEnum.Manage, 'all')) {
      const feedbackUserIds = feedbacks.map(f => f.userId);
      taskUserIds = [...new Set(taskUserIds.concat(feedbackUserIds))];
    }
    if (taskUserIds.length > 0) {
      this.userMap = await this.userService.getUserMap(taskUserIds);
    }
  }

  ngOnInit(): void {
    this.findFeedbacks();
  }

  rateTask(feedback: Feedback) {
    this.dialog
      .open(RatingDialogComponent, {
        width: '50vw',
        disableClose: true,
        autoFocus: 'dialog',
        data: <RatingDialogData>{
          title: this.translateService.instant('name.rateTask'),
          note: this.translateService.instant('note.rateTask'),
          rating: feedback.taskRating,
          ratingComment: feedback.taskRatingComment,
        },
      })
      .afterClosed()
      .subscribe(async (data: RatingDialogData) => {
        if (data) {
          let message = '';
          try {
            const request: RateTaskDto = {
              taskRating: data.rating,
              taskRatingComment: data.ratingComment,
            };
            await firstValueFrom(
              this.feedbackService.rateTask(feedback.id, request),
            );
            feedback.taskRating = data.rating;
            feedback.taskRatingComment = data.ratingComment;
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

  deleteFeedback(feedbackId: string) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: <ConfirmationDialogData>{
        title: this.translateService.instant('action.deleteFeedback'),
        message: this.translateService.instant(
          'note.deleteFeedbackConfirmMessage',
        ),
      },
      width: '50vw',
    });
    dialogRef.afterClosed().subscribe(async confirm => {
      if (confirm) {
        let message = 'notification.delete';
        try {
          await firstValueFrom(this.feedbackService.remove(feedbackId));
          this.findFeedbacks();
        } catch (err) {
          console.log('unable to delete feedback ', err);
          message = 'error.delete';
        } finally {
          this.snackBar.open(this.translateService.instant(message), '', {
            duration: 5000,
          });
        }
      }
    });
  }
}
@NgModule({
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    TranslateModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    NoDataModule,
    MatTooltipModule,
    RolePipeModule,
    PermissionPipeModule,
  ],
  declarations: [FeedbacksComponent],
})
export class FeedbacksModule {}
