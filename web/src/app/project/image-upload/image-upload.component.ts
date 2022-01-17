/**
 * Based on the opensource solution available on github https://gist.github.com/ZakiMohammed/9e5b88146a53570b120a4e9a1244fbeb
 * The solution is copied and modified as per our requirement.
 */

import {
  Component,
  EventEmitter,
  Input,
  NgModule,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  BatchCreateImagesDto,
  FileUploadSignatureResponseDto,
  Image,
  TasksService,
} from '../../../../gen/api/task';
import { firstValueFrom } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { parseError } from '../../error/parse-error';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 100 })),
      transition('* => void', [animate(300, style({ opacity: 0 }))]),
    ]),
  ],
})
export class ImageUploadComponent {
  constructor(
    private readonly taskService: TasksService,
    private readonly snackbar: MatSnackBar,
    private readonly translateService: TranslateService,
    private readonly httpClient: HttpClient,
  ) {
    Window['iuself'] = this;
  }
  /** accepted filed extensions */
  accept = '.jpg, .jpeg, .png';
  files: FileUpload[] = [];
  uploadSignature: FileUploadSignatureResponseDto;

  @Input() readonly: boolean;
  @Input() uniqueId: number;
  @Input() taskId: string;

  /** Emit urls of the uploaded images when the image uploading is completed. */
  @Output() completeEvent = new EventEmitter<void>();

  /**
   * Cancel uploading of image file
   * @param file The file being uploaded
   */
  cancelFile(file: FileUpload) {
    this.removeFileFromArray(file);
  }

  /**
   * Open file browser and initiate uploading
   */
  async initiateImageUpload() {
    const fileUpload = document.getElementById(
      `imageUpload${this.uniqueId}`,
    ) as HTMLInputElement;
    if (!this.uploadSignature) {
      this.uploadSignature = await this.getUploadSignature();
    }
    fileUpload.onchange = () => {
      const files = fileUpload.files ?? new FileList();
      for (let index = 0; index < files.length; index++) {
        const file = files[index];
        this.files.push({
          data: file,
          state: 'in',
          inProgress: false,
          progress: 0,
          canRetry: false,
          canCancel: true,
        });
      }
      this.uploadFiles();
    };
    fileUpload.click();
  }

  async getUploadSignature() {
    try {
      return firstValueFrom(this.taskService.imageUploadSignature(this.taskId));
    } catch (err) {
      console.log('unable to get signature for image upload ', err);
      this.snackbar.open(
        this.translateService.instant('error.imageSignature'),
        '',
        {
          duration: 5000,
        },
      );
      throw new Error(err);
    }
  }

  /**
   * Remove a file from selected files
   * @param file the file being uploaded
   */
  protected removeFileFromArray(file: FileUpload) {
    const index = this.files.indexOf(file);
    if (index > -1) {
      this.files.splice(index, 1);
    }
  }

  /**
   * Retry uploading image file
   *
   * @param file image being uploaded
   */
  retryFile(file: FileUpload) {
    this.uploadFile(file);
    file.canRetry = false;
  }

  /**
   * Upload file logic
   * @param file The file to be uploaded
   * Based on the example from https://cloudinary.com/documentation/upload_images#code_explorer_upload_multiple_files_using_a_form_signed
   */
  protected async uploadFile(file: FileUpload): Promise<Image> {
    if (!this.uploadSignature) {
      return;
    }
    file.inProgress = true;

    const formData = new FormData();
    formData.append('file', file.data);
    formData.append('api_key', this.uploadSignature.apiKey);
    formData.append('timestamp', this.uploadSignature.timestamp.toString());
    formData.append('signature', this.uploadSignature.signature);
    formData.append('folder', this.uploadSignature.folder);

    let uploadUrl = this.uploadSignature.uploadUrl;
    uploadUrl = 'https://add-cors.herokuapp.com/' + uploadUrl;

    try {
      const response: any = await firstValueFrom(
        this.httpClient.post(uploadUrl, formData),
      );
      file.inProgress = false;
      this.removeFileFromArray(file);
      return <Image>{
        url: response.secure_url,
        splitNumber: this.uniqueId,
        cloudId: response.public_id,
      };
    } catch (err) {
      file.inProgress = false;
      this.removeFileFromArray(file);
      console.log('error uploading image to cloudinary', err);
      let message = this.translateService.instant('error.uploadImage');
      const error = parseError(err);
      if (error?.message) {
        message += ' ' + error.message;
      }
      this.snackbar.open(message, '', {
        duration: 5000,
      });
      return Promise.reject(err);
    }
  }

  async batchCreateImages(images: Image[]) {
    const request: BatchCreateImagesDto = {
      images,
    };
    let message = '';
    try {
      await firstValueFrom(
        this.taskService.batchCreateImages(this.taskId, request),
      );
      message = 'notification.imageUpload';
    } catch (err) {
      console.log('err', err);
      message = 'error.saveImageUrls';
    } finally {
      this.snackbar.open(this.translateService.instant(message), '', {
        duration: 5000,
      });
    }
  }

  /**
   * Loop through all selected files and upload them
   */
  private async uploadFiles() {
    const promises: Promise<Image>[] = [];
    const fileUpload = document.getElementById(
      `imageUpload${this.uniqueId}`,
    ) as HTMLInputElement;
    fileUpload.value = '';

    this.files.forEach(file => promises.push(this.uploadFile(file)));
    const images = await Promise.all(promises);
    await this.batchCreateImages(images);
    this.completeEvent.emit();
  }
}

/**
 * A class representing a file upload model
 */
export interface FileUpload {
  canCancel: boolean;
  canRetry: boolean;
  data: File;
  inProgress: boolean;
  progress: number;
  state: string;
}

/**
 * Project module
 * */
@NgModule({
  declarations: [ImageUploadComponent],
  exports: [ImageUploadComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MatProgressBarModule,
    MatIconModule,
    MatButtonModule,
    HttpClientModule,
  ],
})
export class ImageUploadModule {}
