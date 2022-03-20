import { Component, Inject, Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Task, TasksService, UpdateTaskDto } from '../../../gen/api/task';
import { firstValueFrom } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

export interface IframeFormData {
  task: Task;
  prototypeNumber: number;
}

@Component({
  selector: 'app-iframe-form',
  templateUrl: './iframe-form.component.html',
  styleUrls: ['./iframe-form.component.scss'],
})
export class IframeFormComponent {
  control = new FormControl(null, Validators.required);

  constructor(
    private readonly taskService: TasksService,
    private translateService: TranslateService,
    private readonly snackBar: MatSnackBar,
    private dialog: MatDialogRef<IframeFormComponent>,
    @Inject(MAT_DIALOG_DATA) private data: IframeFormData,
  ) {
    if (this.data.prototypeNumber === 1) {
      this.control.setValue(this.data.task.iframeUrl1);
    } else {
      this.control.setValue(this.data.task.iframeUrl2);
    }
  }

  async saveLink() {
    if (this.control.invalid) {
      return;
    }
    const request = <UpdateTaskDto>{};
    if (this.data.prototypeNumber === 1) {
      request.iframeUrl1 = this.control.value;
    } else {
      request.iframeUrl2 = this.control.value;
    }
    let message = 'notification.update';
    try {
      await firstValueFrom(this.taskService.update(this.data.task.id, request));
      this.dialog.close(this.control.value);
    } catch (err) {
      message = 'error.update';
      console.log('Unable to save iframe url ', err);
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
    ReactiveFormsModule,
    MatFormFieldModule,
    TranslateModule,
    MatButtonModule,
    MatInputModule,
  ],
  declarations: [IframeFormComponent],
})
export class IframeFormModule {}
