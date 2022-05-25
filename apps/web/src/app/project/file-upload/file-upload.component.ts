import {
  Component,
  EventEmitter,
  Input,
  NgModule,
  Output,
} from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { HttpClientModule } from "@angular/common/http";
import { CommonModule } from "@angular/common";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { FileUploadSignatureResponseDto, Image } from "../../../gen/api/task";
import { FileUpload, FileUploadService } from "./file-upload.service";
import { firstValueFrom, ReplaySubject } from "rxjs";
import { parseError } from "../../error/parse-error";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";

export interface FileUploadResponse {
  url: string;
  cloudId: string;
}

@Component({
  selector: "app-file-upload",
  templateUrl: "./file-upload.component.html",
  styleUrls: ["./file-upload.component.scss"],
  providers: [FileUploadService],
  animations: [
    trigger("fadeInOut", [
      state("in", style({ opacity: 100 })),
      transition("* => void", [animate(300, style({ opacity: 0 }))]),
    ]),
  ],
})
export class FileUploadComponent {
  accept = ".jpg, .jpeg, .png, .pdf";
  @Input() uploadSignature =
    new ReplaySubject<FileUploadSignatureResponseDto>();
  @Output() fileUploadClick = new EventEmitter<void>();
  /** Emit urls of the uploaded files when the file uploading is completed. */
  @Output() completeEvent = new EventEmitter<FileUploadResponse[]>();

  constructor(
    protected readonly snackbar: MatSnackBar,
    protected readonly translateService: TranslateService,
    readonly fileUploadService: FileUploadService
  ) {}

  async initiateFileUpload() {
    const fileUpload = document.getElementById(
      `fileUpload`
    ) as HTMLInputElement;
    if (!this.fileUploadService.uploadSignature) {
      this.fileUploadClick.emit();
      this.fileUploadService.uploadSignature = await firstValueFrom(
        this.uploadSignature
      );
    }
    await this.fileUploadService.initiateFileUpload(fileUpload);
    this.uploadFiles();
  }

  /**
   * Loop through all selected files and upload them.
   */
  private async uploadFiles() {
    const promises: Promise<FileUploadResponse>[] = [];
    const fileUpload = document.getElementById(
      `fileUpload`
    ) as HTMLInputElement;
    fileUpload.value = "";

    this.fileUploadService.files.forEach((file) =>
      promises.push(this.uploadFile(file))
    );
    const fileUploadResponses = await Promise.all(promises);
    this.completeEvent.emit(fileUploadResponses);
  }

  /**
   * Upload file logic
   * @param file The file to be uploaded
   * Based on the example from https://cloudinary.com/documentation/upload_images#code_explorer_upload_multiple_files_using_a_form_signed
   */
  protected async uploadFile(file: FileUpload): Promise<FileUploadResponse> {
    try {
      const response = await this.fileUploadService.uploadFile(file);
      const fileUploadResponse: FileUploadResponse = {
        url: response.secure_url,
        cloudId: response.public_id,
      };
      return fileUploadResponse;
    } catch (err) {
      let message = this.translateService.instant("error.uploadImage");
      const error = parseError(err);
      if (error?.message) {
        message += " " + error.message;
      }
      this.snackbar.open(message, "", {
        duration: 5000,
      });
      return Promise.reject(err);
    }
  }
}

/**
 * Project module
 * */
@NgModule({
  declarations: [FileUploadComponent],
  exports: [FileUploadComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MatProgressBarModule,
    MatIconModule,
    MatButtonModule,
    HttpClientModule,
  ],
})
export class FileUploadModule {}
