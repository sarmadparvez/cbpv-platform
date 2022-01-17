import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from '../auth/auth.guard';
import { TasksComponent } from './tasks/tasks.component';
import { TaskFeedbackComponent } from './task-feedback/task-feedback.component';

const routes: Routes = [
  {
    path: '',
    component: TasksComponent,
    canActivate: [AuthGuard],
  },
  {
    path: ':taskId',
    component: TaskFeedbackComponent,
    canActivate: [AuthGuard],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TaskModule {}
