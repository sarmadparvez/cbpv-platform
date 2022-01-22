import { Component, NgModule, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Feedback, FeedbacksService, Task } from '../../../../gen/api/task';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NoDataModule } from '../../template/no-data/no-data.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import PaymentStatusEnum = Feedback.PaymentStatusEnum;
import {
  BatchGetUserInfoDto,
  User,
  UsersService,
} from '../../../../gen/api/admin';

@Component({
  selector: 'app-feedbacks',
  templateUrl: './feedbacks.component.html',
  styleUrls: ['./feedbacks.component.scss'],
})
export class FeedbacksComponent implements OnInit {
  dataSource: MatTableDataSource<Feedback>;
  displayedColumns: string[] = [
    'task',
    'prototypeFormat',
    'comment',
    'dateCreated',
    'paymentStatus',
    'incentive',
    'feedbackRating',
    'user',
    'options',
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  PaymentStatus = PaymentStatusEnum;
  userMap: { [key: string]: User } = {};

  constructor(
    private readonly feedbackService: FeedbacksService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly userService: UsersService,
  ) {
    Window['fcself'] = this;
  }

  async findFeedbacks() {
    const feedbacks = await firstValueFrom(this.feedbackService.searchAll());
    this.getUsersForTasks(feedbacks);
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

  async getUsersForTasks(feedbacks: Feedback[]) {
    const ids = feedbacks.map(f => f.task.userId);
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

  ngOnInit(): void {
    this.findFeedbacks();
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
  ],
  declarations: [FeedbacksComponent],
})
export class FeedbacksModule {}
