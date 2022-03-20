import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { FeedbacksComponent } from './feedbacks/feedbacks.component';
import { FeedbackDetailComponent } from './feedback-detail/feedback-detail.component';

const routes: Routes = [
  {
    path: '',
    component: FeedbacksComponent,
    canActivate: [AuthGuard],
  },
  {
    path: ':feedbackId',
    component: FeedbackDetailComponent,
    canActivate: [AuthGuard],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class FeedbackModule {}
