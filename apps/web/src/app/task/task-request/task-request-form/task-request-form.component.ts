import { Component, Inject, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  CreateTaskRequestDto,
  FileUploadSignatureResponseDto,
  Project,
  ProjectsService,
  Task,
  TaskRequest,
  TaskRequestsService,
  TasksService,
  UpdateTaskDto,
} from '../../../../gen/api/task';
import AccessTypeEnum = UpdateTaskDto.AccessTypeEnum;
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { firstValueFrom, ReplaySubject } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import {
  FileUploadModule,
  FileUploadResponse,
} from '../../../project/file-upload/file-upload.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FlexModule } from '@angular/flex-layout';
import { parseError } from '../../../error/parse-error';

export interface TaskRequestFormData {
  task: Task;
  taskRequest?: TaskRequest | undefined;
}

@Component({
  selector: 'app-task-request',
  templateUrl: './task-request-form.component.html',
  styleUrls: ['./task-request-form.component.scss'],
})
export class TaskRequestFormComponent {
  AccessType = AccessTypeEnum;
  task: Task;
  ndaUrl!: string;
  requestComment = new FormControl('');
  uploadSignature = new ReplaySubject<FileUploadSignatureResponseDto>();
  taskRequest: TaskRequest | undefined;
  TaskRequestStatus = TaskRequest.RequestStatusEnum;

  constructor(
    private dialog: MatDialogRef<TaskRequestFormComponent>,
    private readonly projectService: ProjectsService,
    private readonly taskService: TasksService,
    private readonly taskRequestService: TaskRequestsService,
    private readonly snackbar: MatSnackBar,
    private readonly translateService: TranslateService,
    private readonly dialogRef: MatDialogRef<TaskRequestFormComponent>,
    @Inject(MAT_DIALOG_DATA) data: TaskRequestFormData
  ) {
    this.task = data.task;
    if (data.taskRequest) {
      this.taskRequest = data.taskRequest;
      if (this.taskRequest.requestComment) {
        this.requestComment.setValue(this.taskRequest.requestComment);
      }
      if (this.taskRequest.requestStatus === this.TaskRequestStatus.Requested) {
        this.requestComment.disable();
      }
    }
    if (this.task.accessType === AccessTypeEnum.Nda) {
      this.getNdaUrl();
    }
  }

  async getNdaUrl() {
    try {
      const response = await firstValueFrom(
        this.projectService.findNdaUrl(this.task.projectId)
      );
      this.ndaUrl = response.ndaUrl;
    } catch (err) {
      console.log('failed to get Nda Url ', err);
      const error = parseError(err);
      if (error?.message) {
        this.snackbar.open(error.message, '', {
          duration: 5000,
        });
      }
      this.dialogRef.close();
    }
  }

  async request() {
    if (
      this.task.accessType === AccessTypeEnum.Nda &&
      !this.taskRequest?.ndaUrl
    ) {
      const error = this.translateService.instant('error.uploadSignedNDA');
      this.snackbar.open(error, '', {
        duration: 5000,
      });
      return;
    }
    const requestComment = this.requestComment.value;

    const request: CreateTaskRequestDto = {
      ndaUrl: this.taskRequest?.ndaUrl,
      ndaCloudId: this.taskRequest?.ndaCloudId,
      taskId: this.task.id,
    };
    if (requestComment) {
      request.requestComment = requestComment;
    }
    try {
      if (!this.taskRequest?.id) {
        await firstValueFrom(this.taskRequestService.create(request));
      } else {
        request.requestStatus = this.TaskRequestStatus.Requested;
        await firstValueFrom(
          this.taskRequestService.update(this.taskRequest.id, request)
        );
      }
      const successMessage = this.translateService.instant(
        'notification.requestSubmitted'
      );
      this.snackbar.open(successMessage, '', {
        duration: 5000,
      });
      this.dialogRef.close();
    } catch (err) {
      console.log('failed request ', err);
      const error = parseError(err);
      if (error?.message) {
        this.snackbar.open(error.message, '', {
          duration: 5000,
        });
      }
    }
  }

  saveNDAUrl(fileUploads: FileUploadResponse[]) {
    if (!fileUploads) {
      throw new Error('File upload url set');
    }

    if (!this.taskRequest) {
      this.taskRequest = <TaskRequest>{
        taskId: this.task.id,
        ndaUrl: fileUploads[0].url,
        ndaCloudId: fileUploads[0].cloudId,
      };
    } else {
      this.taskRequest.ndaUrl = fileUploads[0].url;
      this.taskRequest.ndaCloudId = fileUploads[0].cloudId;
    }
  }

  async getUploadSignature() {
    try {
      const signature = await firstValueFrom(
        this.taskService.fileUploadSignature(this.task.id)
      );
      this.uploadSignature.next(signature);
    } catch (err) {
      console.log('unable to get signature for file upload ', err);
      this.snackbar.open(
        this.translateService.instant('error.imageSignature'),
        '',
        {
          duration: 5000,
        }
      );
      throw err;
    }
  }
}

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    TranslateModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    FileUploadModule,
    FlexModule,
  ],
  declarations: [TaskRequestFormComponent],
})
export class TaskModule {}
