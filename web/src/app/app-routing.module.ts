import { NgModule } from '@angular/core';
import {
  Routes,
  RouterModule,
  PreloadAllModules,
  RouteReuseStrategy,
} from '@angular/router';
import { NavComponent } from './nav/nav.component';

const routes: Routes = [
  {
    path: 'access',
    loadChildren: () =>
      import('./access/access.module').then(m => m.AccessModule),
  },
  {
    path: 'home',
    component: NavComponent,
    loadChildren: () =>
      import('./home/home-page.module').then(m => m.HomePageModule),
  },
  {
    path: 'projects',
    component: NavComponent,
    loadChildren: () =>
      import('./project/project.module').then(m => m.ProjectModule),
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
