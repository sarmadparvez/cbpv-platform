import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateUserReportDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsUUID()
  @IsNotEmpty()
  feedbackId: string;

  @IsUUID()
  @IsNotEmpty()
  projectId: string;

  @IsUUID()
  @IsNotEmpty()
  taskId: string;

  @IsUUID()
  @IsNotEmpty()
  reportedUserId: string;
}
