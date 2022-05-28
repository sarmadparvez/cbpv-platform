import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { NgModule } from '@angular/core';
import { UserReportsComponent } from './user-reports/user-reports.component';

const routes: Routes = [
  {
    path: '',
    component: UserReportsComponent,
    canActivate: [AuthGuard],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class UserReportModule {}
