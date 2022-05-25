import { Injectable } from "@angular/core";
import { FileUploadSignatureResponseDto, Image } from "../../../gen/api/task";
import { firstValueFrom } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class FileUploadService {
  constructor(protected readonly httpClient: HttpClient) {}
  files: FileUpload[] = [];
  uploadSignature!: FileUploadSignatureResponseDto;

  /**
   * Cancel uploading of image file
   * @param file The file being uploaded
   */
  cancelFile(file: FileUpload) {
    this.removeFileFromArray(file);
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
   * Remove a file from selected files
   * @param file the file being uploaded
   */
  removeFileFromArray(file: FileUpload) {
    const index = this.files.indexOf(file);
    if (index > -1) {
      this.files.splice(index, 1);
    }
  }

  async uploadFile(file: FileUpload) {
    if (!this.uploadSignature) {
      throw new Error("Upload signature not found");
    }
    file.inProgress = true;

    const formData = new FormData();
    formData.append("file", file.data);
    formData.append("api_key", this.uploadSignature.apiKey);
    formData.append("timestamp", this.uploadSignature.timestamp.toString());
    formData.append("signature", this.uploadSignature.signature);
    formData.append("folder", this.uploadSignature.folder);

    let uploadUrl = this.uploadSignature.uploadUrl;
    uploadUrl = "https://add-cors.herokuapp.com/" + uploadUrl;

    try {
      const response: any = await firstValueFrom(
        this.httpClient.post(uploadUrl, formData)
      );
      file.inProgress = false;
      this.removeFileFromArray(file);
      return response;
    } catch (err) {
      console.log("error uploading image to cloudinary", err);
      file.inProgress = false;
      this.removeFileFromArray(file);
      throw err;
    }
  }

  /**
   * Open file browser and initiate uploading
   */
  async initiateFileUpload(fileUpload: HTMLInputElement) {
    if (!this.uploadSignature) {
      throw new Error("upload signature not set");
    }
    return new Promise<void>((resolve) => {
      fileUpload.onchange = () => {
        const files = fileUpload.files ?? new FileList();
        for (let index = 0; index < files.length; index++) {
          const file = files[index];
          this.files.push({
            data: file,
            state: "in",
            inProgress: false,
            progress: 0,
            canRetry: false,
            canCancel: true,
          });
        }
        resolve();
      };
      fileUpload.click();
    });
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
