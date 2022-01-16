import { Component, Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReplaySubject } from 'rxjs';
import { Question, Task } from '../../../../gen/api/task';
import { FlexModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { NgxMaterialRatingModule } from 'ngx-material-rating';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-questionnaire-detail',
  templateUrl: './questionnaire-detail.component.html',
  styleUrls: ['./questionnaire-detail.component.scss'],
})
export class QuestionnaireDetailComponent {
  @Input() readonly: boolean;
  QuestionType = Question.TypeEnum;

  @Input() task: ReplaySubject<Task>;

  constructor() {
    Window['qdself'] = this;
  }
}

@NgModule({
  imports: [
    CommonModule,
    FlexModule,
    TranslateModule,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    NgxMaterialRatingModule,
    MatIconModule,
  ],
  declarations: [QuestionnaireDetailComponent],
  exports: [QuestionnaireDetailComponent],
})
export class QuestionnaireDetailModule {}
