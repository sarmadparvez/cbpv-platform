import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginGuard } from './login/login.guard';
import { LoginComponent } from './login/login.component';
import {
  RegisterComponent,
  RegisterModule,
} from './register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/access/login',
    pathMatch: 'full',
  },
  {
    path: '',
    children: [
      {
        path: 'login',
        canActivate: [LoginGuard],
        component: LoginComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
        canActivate: [LoginGuard],
      },
    ],
  },
];

/**
 * This Module is responsible for the components regarding setting up a company
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class AccessModule {}
