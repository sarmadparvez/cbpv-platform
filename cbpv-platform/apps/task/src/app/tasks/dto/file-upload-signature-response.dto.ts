export class FileUploadSignatureResponseDto {
  apiKey: string;
  uploadUrl: string;
  signature: string;
  timestamp: number;
  folder: string;
}
