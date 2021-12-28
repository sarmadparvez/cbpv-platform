import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Answer } from '../entities/answer.entity';

export class CreateFeedbackDto {
  @IsString()
  @IsOptional()
  comment?: string;

  @IsUUID()
  @IsNotEmpty()
  taskId: string;

  @IsArray()
  answers: Answer[];
}
