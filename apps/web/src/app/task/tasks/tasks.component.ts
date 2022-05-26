import { Component, NgModule, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  Task,
  TaskRequest,
  UpdateTaskDto,
  UpdateTaskRequestDto,
} from '../../../gen/api/task/model/models';
import { TaskRequestsService, TasksService } from '../../../gen/api/task';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { NoDataModule } from '../../template/no-data/no-data.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserMap, UserService } from '../../user/user.service';
import AccessTypeEnum = UpdateTaskDto.AccessTypeEnum;
import { MatDialog } from '@angular/material/dialog';
import {
  TaskRequestFormComponent,
  TaskRequestFormData,
} from '../task-request/task-request-form/task-request-form.component';
import RequestStatusEnum = UpdateTaskRequestDto.RequestStatusEnum;

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
  providers: [UserService],
})
export class TasksComponent {
  dataSource: MatTableDataSource<Task> = new MatTableDataSource<Task>([]);
  displayedColumns: string[] = [
    'title',
    'dateCreated',
    'prototypeFormat',
    'testType',
    'skills',
    'country',
    'user',
    'options',
  ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  userMap: UserMap = {};

  constructor(
    private readonly taskService: TasksService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly userService: UserService,
    private readonly dialog: MatDialog,
    private readonly taskRequestService: TaskRequestsService
  ) {
    this.findOpenTasks();
  }

  async findOpenTasks() {
    const tasks = await firstValueFrom(this.taskService.findOpenTasks());
    this.getUsersForTasks(tasks);
    this.dataSource = new MatTableDataSource(tasks);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.setFilterFunction();
  }

  async getUsersForTasks(tasks: Task[]) {
    const ids = tasks.map((f) => f.userId);
    if (ids.length > 0) {
      this.userMap = await this.userService.getUserMap(ids);
    }
  }

  /**
   * Set custom filter function for data source. Because our data source contains nested objects and we want to filter by them.
   * Solution copied from https://stackoverflow.com/questions/49833315/angular-material-2-datasource-filter-with-nested-object
   */
  setFilterFunction() {
    this.dataSource.filterPredicate = (data, filter: string) => {
      const accumulator = (currentTerm: any, key: any) => {
        return this.nestedFilterCheck(currentTerm, data, key);
      };
      const dataStr = Object.keys(data).reduce(accumulator, '').toLowerCase();
      const transformedFilter = filter.trim().toLowerCase();
      return dataStr.indexOf(transformedFilter) !== -1;
    };
  }

  /**
   * Nested filter checking solution copied from https://stackoverflow.com/questions/49833315/angular-material-2-datasource-filter-with-nested-object
   */
  nestedFilterCheck(search: any, data: any, key: any) {
    if (typeof data[key] === 'object') {
      for (const k in data[key]) {
        if (data[key][k] !== null) {
          search = this.nestedFilterCheck(search, data[key], k);
        }
      }
    } else {
      search += data[key];
    }
    return search;
  }

  async openTask(event: MouseEvent, task: Task) {
    event.preventDefault();
    if (task.accessType === AccessTypeEnum.Open) {
      this.router.navigate([task.id], {
        relativeTo: this.route,
      });
    } else {
      let taskRequest: TaskRequest | undefined;
      try {
        taskRequest = await firstValueFrom(
          this.taskRequestService.searchRequest(task.id)
        );
        if (taskRequest?.requestStatus === RequestStatusEnum.Accepted) {
          this.router.navigate([task.id], {
            relativeTo: this.route,
          });
          return;
        }
      } catch (err) {
        console.log('failed to get TaskRequest', err);
      }
      this.dialog.open(TaskRequestFormComponent, {
        width: '50%',
        data: <TaskRequestFormData>{
          task,
          taskRequest,
        },
        autoFocus: false,
      });
    }
  }

  async getTaskRequest(taskId: string) {
    return firstValueFrom(this.taskRequestService.searchRequest(taskId));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

@NgModule({
  imports: [
    CommonModule,
    NoDataModule,
    MatPaginatorModule,
    MatMenuModule,
    MatIconModule,
    MatTableModule,
    TranslateModule,
    MatChipsModule,
    MatButtonModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  declarations: [TasksComponent],
})
export class TasksModule {}
