import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './home-page.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { RolePipeModule } from '../iam/role.pipe';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Routes inside the home module
 * */
export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  declarations: [HomePageComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    RolePipeModule,
    TranslateModule,
  ],
})
export class HomePageModule {}
