import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { TaskRequestStatus } from '../entities/task-request.entity';

export class CreateTaskRequestDto {
  @IsString()
  @IsOptional()
  requestComment?: string;
  @IsString()
  @IsOptional()
  rejectionComment?: string;
  @IsString()
  @IsOptional()
  ndaUrl?: string;
  @IsEnum(TaskRequestStatus)
  @IsOptional()
  requestStatus?: TaskRequestStatus;
  @IsUUID()
  @IsNotEmpty()
  taskId: string;
  @IsString()
  @IsOptional()
  ndaCloudId?: string;
}
