import { ProjectsComponent } from './projects/projects.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from '../auth/auth.guard';
import { ProjectComponent } from './project/project.component';

const routes: Routes = [
  {
    path: '',
    component: ProjectsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: ':projectId',
    component: ProjectComponent,
    canActivate: [AuthGuard],
  },
];

/**
 * Project module
 * */
@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class ProjectModule {}
