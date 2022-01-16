import { Component, Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom, ReplaySubject } from 'rxjs';
import { Question, Task } from '../../../../gen/api/task';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { FlexModule } from '@angular/flex-layout';
import { MatDialog } from '@angular/material/dialog';
import { QuestionnaireFormComponent } from '../questionnaire-form/questionnaire-form.component';
import { QuestionnaireDetailModule } from '../questionnaire-detail/questionnaire-detail.component';

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.scss'],
})
export class QuestionnaireComponent {
  @Input() task: ReplaySubject<Task>;
  TaskStatusEnum = Task.StatusEnum;

  constructor(private readonly dialog: MatDialog) {}

  async openEditDialog() {
    const task = await firstValueFrom(this.task);
    this.dialog
      .open(QuestionnaireFormComponent, {
        data: task,
        disableClose: true,
        width: '55vw',
      })
      .afterClosed()
      .subscribe((questions: Question[]) => {
        if (questions) {
          task.questions = questions;
          this.task.next(task);
        }
      });
  }
}

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    TranslateModule,
    MatButtonModule,
    FlexModule,
    QuestionnaireDetailModule,
  ],
  declarations: [QuestionnaireComponent],
  exports: [QuestionnaireComponent],
})
export class QuestionnaireModule {}
