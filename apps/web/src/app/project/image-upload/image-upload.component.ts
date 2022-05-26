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
  Image,
  TasksService,
} from '../../../gen/api/task';
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
import {
  FileUpload,
  FileUploadService,
} from '../file-upload/file-upload.service';

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
  providers: [FileUploadService],
})
export class ImageUploadComponent {
  constructor(
    protected readonly taskService: TasksService,
    protected readonly snackbar: MatSnackBar,
    protected readonly translateService: TranslateService,
    protected readonly httpClient: HttpClient,
    readonly fileUploadService: FileUploadService
  ) {}
  /** accepted filed extensions */
  accept = '.jpg, .jpeg, .png';

  @Input() readonly!: boolean;
  @Input() uniqueId!: number;
  @Input() taskId: string | undefined;

  /** Emits event when the image uploading is completed. */
  @Output() completeEvent = new EventEmitter<void>();

  /**
   * Open file browser and initiate uploading
   */
  async initiateImageUpload() {
    const fileUpload = document.getElementById(
      `fileUpload${this.uniqueId}`
    ) as HTMLInputElement;
    if (!this.fileUploadService.uploadSignature) {
      this.fileUploadService.uploadSignature = await this.getUploadSignature();
    }
    await this.fileUploadService.initiateFileUpload(fileUpload);
    this.uploadFiles();
  }

  async getUploadSignature() {
    if (!this.taskId) {
      throw new Error('taskId not set');
    }
    try {
      return firstValueFrom(this.taskService.imageUploadSignature(this.taskId));
    } catch (err) {
      console.log('unable to get signature for image upload ', err);
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

  /**
   * Upload file logic
   * @param file The file to be uploaded
   * Based on the example from https://cloudinary.com/documentation/upload_images#code_explorer_upload_multiple_files_using_a_form_signed
   */
  protected async uploadFile(file: FileUpload): Promise<Image> {
    try {
      const response = await this.fileUploadService.uploadFile(file);
      return <Image>{
        url: response.secure_url,
        prototypeNumber: this.uniqueId,
        cloudId: response.public_id,
      };
    } catch (err) {
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
    if (!this.taskId) {
      throw new Error('taskId not set');
    }
    const request: BatchCreateImagesDto = {
      images,
    };
    let message = '';
    try {
      await firstValueFrom(
        this.taskService.batchCreateImages(this.taskId, request)
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
      `fileUpload${this.uniqueId}`
    ) as HTMLInputElement;
    fileUpload.value = '';

    this.fileUploadService.files.forEach((file) =>
      promises.push(this.uploadFile(file))
    );
    const images = await Promise.all(promises);
    await this.batchCreateImages(images);
    this.completeEvent.emit();
  }
}

/**
 * Image Upload module
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
