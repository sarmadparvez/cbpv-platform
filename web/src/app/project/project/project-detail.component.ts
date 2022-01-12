import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FlexModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskFormComponent } from '../task-form/task-form.component';
import { MatDialog } from '@angular/material/dialog';
import {
  Project,
  ProjectsService,
  Task,
  TasksService,
} from '../../../../gen/api/task';
import { firstValueFrom } from 'rxjs';
import { TaskDetailModule } from '../task-detail/task-detail.component';
import StatusEnum = Task.StatusEnum;
import PrototypeFormatEnum = Task.PrototypeFormatEnum;
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImagePrototypeModule } from '../image-prototype/image-prototype.component';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss'],
})
export class ProjectDetailComponent {
  PrototypeFormatEnum = PrototypeFormatEnum;
  taskControl = new FormControl('');
  projectId: string;
  tasks: Task[] = [];
  task: Task;
  project: Project;
  StatusEnum = StatusEnum;
  constructor(
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly route: ActivatedRoute,
    private readonly taskService: TasksService,
    private readonly projectService: ProjectsService,
    private readonly snackBar: MatSnackBar,
    private readonly translateService: TranslateService,
  ) {
    Window['pcself'] = this;
    this.projectId = this.route.snapshot.paramMap.get('projectId');
    this.getProject();
    this.searchTasks();

    this.taskControl.valueChanges.subscribe((task: Task) => (this.task = task));
  }

  async searchTasks() {
    try {
      this.tasks = await firstValueFrom(
        this.taskService.findIterations(this.projectId),
      );
      this.taskControl.setValue(this.tasks[0]);
    } catch (err) {
      console.log('unable to get task iterations ', err);
    }
  }

  async getProject() {
    this.project = await firstValueFrom(
      this.projectService.findOne(this.projectId),
    );
  }

  openTaskForm(edit?: boolean) {
    this.dialog
      .open(TaskFormComponent, {
        disableClose: true,
        width: '70vw',
        data: {
          task: edit ? this.task : null,
          projectId: this.projectId,
        },
      })
      .afterClosed()
      .subscribe((taskId: string) => {
        if (taskId) {
          if (!this.task) {
            // creation case, fetch all tasks
            this.searchTasks();
          } else {
            this.getTask(taskId);
          }
        }
      });
  }

  async getTask(id: string) {
    const task = await firstValueFrom(this.taskService.findOne(this.task.id));
    const index = this.tasks.findIndex(t => t.id === task.id);
    if (index > -1) {
      this.tasks[index] = task;
      this.taskControl.setValue(task);
    }
  }

  routeToProjects() {
    this.router.navigate(['projects']);
  }

  async deleteTask() {
    let message = '';
    try {
      await firstValueFrom(this.taskService.remove(this.task.id));
      message = this.translateService.instant('notification.delete');
      const taskIndex = this.tasks.findIndex(t => t.id === this.task.id);
      this.tasks.splice(taskIndex, 1);
      this.task = this.tasks[0];
      this.taskControl.setValue(this.task);
    } catch (err) {
      console.log('error deleting task ', err);
      message = this.translateService.instant('error.delete');
    } finally {
      this.snackBar.open(message, '', { duration: 3000 });
    }
  }
}

/**
 * Project module
 * */
@NgModule({
  declarations: [ProjectDetailComponent],
  imports: [
    CommonModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatSidenavModule,
    FlexModule,
    MatButtonModule,
    TranslateModule,
    TaskDetailModule,
    MatMenuModule,
    MatIconModule,
    ImagePrototypeModule,
  ],
})
export class ProjectDetailModule {}
