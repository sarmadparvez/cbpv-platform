import { Component, Input, NgModule, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom, ReplaySubject } from 'rxjs';
import { Task, TaskRequest, TasksService } from '../../../../gen/api/task';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UserMap, UserService } from '../../../user/user.service';
import { MatDialog } from '@angular/material/dialog';
import {
  TaskRequestReviewComponent,
  TaskRequestReviewData,
} from '../task-request-review/task-request-review.component';
import { NoDataModule } from '../../../template/no-data/no-data.component';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SubscriptionComponent } from '../../../common/subscription.component';

@Component({
  selector: 'app-task-requests',
  templateUrl: './task-requests.component.html',
  styleUrls: ['./task-requests.component.scss'],
  providers: [UserService],
})
export class TaskRequestsComponent
  extends SubscriptionComponent
  implements OnInit
{
  @Input() task = new ReplaySubject<Task>(1);
  dataSource: MatTableDataSource<TaskRequest> =
    new MatTableDataSource<TaskRequest>([]);
  displayedColumns: string[] = [
    'user',
    'dateCreated',
    'requestComment',
    'ndaUrl',
    'requestStatus',
    'options',
  ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  userMap: UserMap = {};

  constructor(
    private readonly taskService: TasksService,
    private readonly userService: UserService,
    private readonly dialog: MatDialog
  ) {
    super();
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.task.subscribe((task) => {
        if (task) {
          this.findTaskRequests(task.id);
        }
      })
    );
  }

  async findTaskRequests(taskId: string) {
    const taskRequests = await firstValueFrom(
      this.taskService.findTaskRequests(taskId)
    );
    this.getUsersForTaskRequests(taskRequests);
    this.dataSource = new MatTableDataSource(taskRequests);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  async getUsersForTaskRequests(taskRequests: TaskRequest[]) {
    const ids = taskRequests.map((t) => t.userId);
    if (ids.length > 0) {
      this.userMap = await this.userService.getUserMap(ids);
    }
  }

  async openTaskRequest(taskRequest: TaskRequest) {
    const task = await firstValueFrom(this.task);

    this.dialog
      .open(TaskRequestReviewComponent, {
        data: <TaskRequestReviewData>{
          task,
          taskRequest,
        },
        disableClose: true,
        autoFocus: 'dialog',
        width: '50vw',
      })
      .afterClosed()
      .subscribe((updated: boolean) => {
        if (updated) {
          this.findTaskRequests(task.id);
        }
      });
  }

  download(event: MouseEvent, url: string) {
    event.stopPropagation();
    window.open(url, '_blank');
  }
}

@NgModule({
  imports: [
    CommonModule,
    MatPaginatorModule,
    NoDataModule,
    MatMenuModule,
    MatTableModule,
    TranslateModule,
    MatTooltipModule,
    MatIconModule,
    MatButtonModule,
  ],
  declarations: [TaskRequestsComponent],
  exports: [TaskRequestsComponent],
})
export class TaskRequestsModule {}
