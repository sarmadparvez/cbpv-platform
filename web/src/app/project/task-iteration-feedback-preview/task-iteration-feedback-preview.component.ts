import { Component, Inject, Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feedback, Task } from '../../../../gen/api/task';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { QuestionnaireAnswerModule } from '../../task/questionnaire-answer/questionnaire-answer.component';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { User } from '../../../../gen/api/admin';
import { NgxMaterialRatingModule } from 'ngx-material-rating';
import { FlexModule } from '@angular/flex-layout';

export interface TaskFeedbackPreviewDialogData {
  task: Task;
  feedback: Feedback;
  user: User;
}

@Component({
  selector: 'app-task-iteration-feedback-preview',
  templateUrl: './task-iteration-feedback-preview.component.html',
  styleUrls: ['./task-iteration-feedback-preview.component.scss'],
})
export class TaskIterationFeedbackPreviewComponent {
  @Input() task: Task;
  @Input() feedback: Feedback;
  @Input() user: User;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: TaskFeedbackPreviewDialogData,
  ) {
    if (this.data) {
      this.task = this.data.task;
      this.feedback = this.data.feedback;
      this.user = this.data.user;
    }
  }
}

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    QuestionnaireAnswerModule,
    MatButtonModule,
    TranslateModule,
    NgxMaterialRatingModule,
    FlexModule,
  ],
  declarations: [TaskIterationFeedbackPreviewComponent],
})
export class TaskFeedbackPreviewModule {}
