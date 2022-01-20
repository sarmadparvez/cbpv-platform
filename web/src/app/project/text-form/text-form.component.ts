import { Component, Inject, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task, TasksService, UpdateTaskDto } from '../../../../gen/api/task';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

export interface TextFormData {
  task: Task;
  prototypeNumber: number;
}
@Component({
  selector: 'app-text-form',
  templateUrl: './text-form.component.html',
  styleUrls: ['./text-form.component.scss'],
})
export class TextFormComponent {
  control = new FormControl(null, Validators.required);
  constructor(
    private readonly taskService: TasksService,
    private translateService: TranslateService,
    private readonly snackBar: MatSnackBar,
    private dialog: MatDialogRef<TextFormComponent>,
    @Inject(MAT_DIALOG_DATA) private data: TextFormData,
  ) {
    if (this.data.prototypeNumber === 1) {
      this.control.setValue(this.data.task.textualDescription1);
    } else {
      this.control.setValue(this.data.task.textualDescription2);
    }
  }

  async saveDescription() {
    if (this.control.invalid) {
      return;
    }
    const request = <UpdateTaskDto>{};
    if (this.data.prototypeNumber === 1) {
      request.textualDescription1 = this.control.value;
    } else {
      request.textualDescription2 = this.control.value;
    }
    let message = 'notification.update';
    try {
      await firstValueFrom(this.taskService.update(this.data.task.id, request));
      this.dialog.close(this.control.value);
    } catch (err) {
      message = 'error.update';
      console.log('Unable to save textual description', err);
    } finally {
      // Message
      this.snackBar.open(this.translateService.instant(message), '', {
        duration: 5000,
      });
    }
  }
}

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    TranslateModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
  ],
  declarations: [TextFormComponent],
})
export class TextFormModule {}
