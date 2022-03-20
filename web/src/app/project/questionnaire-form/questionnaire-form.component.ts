import { Component, Inject, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  Question,
  Task,
  TasksService,
  UpdateTaskDto,
} from '../../../../gen/api/task';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FlexModule } from '@angular/flex-layout';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { COMMA, ENTER, F } from '@angular/cdk/keycodes';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatChipInputEvent } from '@angular/material/chips';
import { firstValueFrom } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-questionnaire-form',
  templateUrl: './questionnaire-form.component.html',
  styleUrls: ['./questionnaire-form.component.scss'],
})
export class QuestionnaireFormComponent implements OnInit {
  ObjectKeys = Object.keys;
  formGroups: FormGroup[] = [];
  QuestionTypeEnum = Question.TypeEnum;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  task: Task;

  constructor(
    private readonly dialog: MatDialogRef<QuestionnaireFormComponent>,
    private readonly fb: FormBuilder,
    private readonly taskService: TasksService,
    private snackBar: MatSnackBar,
    private translateService: TranslateService,
    @Inject(MAT_DIALOG_DATA) private data: Task,
  ) {
    this.task = this.data;
  }

  ngOnInit(): void {
    this.populateFormWithQuestions();
  }

  populateFormWithQuestions() {
    this.task.questions.forEach((question, index) => {
      this.formGroups.push(
        this.fb.group({
          id: [question.id],
          question: [question.description, Validators.required],
          type: [question.type, Validators.required],
          radioOptions: [
            question.radioOptions ? question.radioOptions : [],
            [() => this.validateRadioOptions(index)],
          ],
        }),
      );
    });
  }

  async saveQuestionnaire() {
    const invalid = this.formGroups.filter(f => f.invalid);
    if (invalid.length > 0) {
      invalid.forEach(f => f.markAllAsTouched());
      return;
    }
    const request = <UpdateTaskDto>{
      questions: [],
    };
    this.formGroups.forEach((form, index) => {
      if (form.controls.type.value !== Question.TypeEnum.Radio) {
        form.controls.radioOptions.setValue([]);
      }
      request.questions.push({
        order: index + 1,
        taskId: this.task.id,
        id: form.controls.id?.value,
        description: form.controls.question.value,
        type: form.controls.type.value,
        radioOptions:
          form.controls.radioOptions.value.length > 0
            ? form.controls.radioOptions.value
            : null,
      });
    });
    let message = '';
    try {
      const response = await firstValueFrom(
        this.taskService.update(this.task.id, request),
      );
      message = 'notification.update';
      this.dialog.close(response.questions);
    } catch (err) {
      message = 'error.update';
      console.log('err saving Questions ', err);
    } finally {
      this.snackBar.open(this.translateService.instant(message), '', {
        duration: 5000,
      });
    }
  }

  addQuestion() {
    const index = this.formGroups.length;
    this.formGroups.push(
      this.fb.group({
        question: ['', Validators.required],
        type: ['', Validators.required],
        radioOptions: [[], [() => this.validateRadioOptions(index)]],
      }),
    );
  }

  addRadioOption(event: MatChipInputEvent, control: AbstractControl) {
    const value = (event.value || '').trim();

    if (value) {
      if (!control.value || typeof control.value !== 'object') {
        control.setValue([]);
      }
      control.value.push(value);
    }
    event.chipInput!.clear();
    control.updateValueAndValidity();
  }

  removeRadioOption(option: string, control: AbstractControl) {
    const index = control.value.indexOf(option);

    if (index >= 0) {
      control.value.splice(index, 1);
    }
    control.updateValueAndValidity();
  }

  validateRadioOptions(formIndex: number): ValidationErrors | null {
    if (
      this.formGroups &&
      this.formGroups[formIndex]?.controls.type.value ===
        Question.TypeEnum.Radio &&
      this.formGroups[formIndex]?.controls.radioOptions.value?.length === 0
    ) {
      return {
        required: true,
      };
    }
    return null;
  }

  moveQuestion(event: CdkDragDrop<void>) {
    moveItemInArray(this.formGroups, event.previousIndex, event.currentIndex);
  }

  deleteQuestion(index: number) {
    this.formGroups.splice(index, 1);
  }

  typeChanged(event: MatSelectChange, index: number) {
    if (event.value !== Question.TypeEnum.Radio) {
      this.formGroups[index].controls.radioOptions.updateValueAndValidity();
    }
  }

  getSelectedOptions(control: AbstractControl) {
    if (control.value != null && typeof control.value === 'object') {
      return control.value;
    }
    control.setValue([]);
    return [];
  }
}

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    FlexModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatChipsModule,
    DragDropModule,
  ],
  declarations: [QuestionnaireFormComponent],
})
export class QuestionnaireFormModule {}
