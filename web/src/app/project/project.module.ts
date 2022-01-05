import { ProjectsComponent } from './projects/projects.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: ProjectsComponent,
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
