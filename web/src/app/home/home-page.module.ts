import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './home-page.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';

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
  imports: [RouterModule.forChild(routes), CommonModule],
})
export class HomePageModule {}
