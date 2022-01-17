import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { NavComponent } from './navigation/nav.component';
import { Action } from '../../gen/api/admin';
import ActionEnum = Action.ActionEnum;
import { RouteGuard } from './auth/route.guard';

const routes: Routes = [
  {
    path: 'access',
    loadChildren: () =>
      import('./access/access.module').then(m => m.AccessModule),
  },
  {
    path: 'profile',
    component: NavComponent,
    loadChildren: () =>
      import('./profile/profile.module').then(m => m.ProfileModule),
  },
  {
    path: 'home',
    component: NavComponent,
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
  },
  {
    path: 'projects',
    component: NavComponent,
    data: {
      permission: ActionEnum.Manage,
      subject: 'Project',
    },
    canActivate: [RouteGuard],
    loadChildren: () =>
      import('./project/project.module').then(m => m.ProjectModule),
  },
  {
    path: 'tasks',
    component: NavComponent,
    data: {
      permission: ActionEnum.Manage,
      subject: 'Feedback',
    },
    canActivate: [RouteGuard],
    loadChildren: () => import('./task/task.module').then(m => m.TaskModule),
  },
  {
    path: '**',
    redirectTo: '/access/login',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
