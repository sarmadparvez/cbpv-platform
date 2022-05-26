import { Component, Inject, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  Task,
  TaskRequest,
  TaskRequestsService,
  UpdateTaskDto,
  UpdateTaskRequestDto,
} from '../../../../gen/api/task';
import AccessTypeEnum = UpdateTaskDto.AccessTypeEnum;
import { MatButtonModule } from '@angular/material/button';
import RequestStatusEnum = UpdateTaskRequestDto.RequestStatusEnum;
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { parseError } from '../../../error/parse-error';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';

export interface TaskRequestReviewData {
  taskRequest: TaskRequest;
  task: Task;
}
@Component({
  selector: 'app-task-request-review',
  templateUrl: './task-request-review.component.html',
  styleUrls: ['./task-request-review.component.scss'],
})
export class TaskRequestReviewComponent {
  AccessType = AccessTypeEnum;
  RequestStatusEnum = RequestStatusEnum;
  TaskStatusEnum = Task.StatusEnum;
  taskRequest: TaskRequest;
  task: Task;
  rejectionComment = new FormControl('');
  constructor(
    private readonly taskRequestService: TaskRequestsService,
    private readonly dialogRef: MatDialogRef<TaskRequestReviewComponent>,
    private readonly snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) data: TaskRequestReviewData
  ) {
    this.taskRequest = data.taskRequest;
    this.task = data.task;
    if (this.taskRequest.rejectionComment) {
      this.rejectionComment.setValue(this.taskRequest.rejectionComment);
    }
    if (this.taskRequest.requestStatus !== RequestStatusEnum.Requested) {
      this.rejectionComment.disable();
    }
  }

  async update(requestStatus: RequestStatusEnum) {
    const request: UpdateTaskRequestDto = {
      requestStatus,
    };
    const rejectionComment = this.rejectionComment.value;
    if (requestStatus === RequestStatusEnum.Rejected && rejectionComment) {
      request.rejectionComment = rejectionComment;
    }
    try {
      await firstValueFrom(
        this.taskRequestService.update(this.taskRequest.id, request)
      );
      this.dialogRef.close(true);
    } catch (err) {
      console.log('failed to update TaskRequest ', err);
      const error = parseError(err);
      if (error?.message) {
        this.snackbar.open(error.message, '', {
          duration: 5000,
        });
      }
    }
  }
}

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  declarations: [TaskRequestReviewComponent],
})
export class TaskRequestReviewModule {}
