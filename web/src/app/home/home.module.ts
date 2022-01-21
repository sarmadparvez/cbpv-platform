import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { RolePipeModule } from '../iam/role.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { FlexModule } from '@angular/flex-layout';

/**
 * Routes inside the home module
 * */
export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  declarations: [HomeComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    RolePipeModule,
    TranslateModule,
    FlexModule,
  ],
})
export class HomeModule {}
