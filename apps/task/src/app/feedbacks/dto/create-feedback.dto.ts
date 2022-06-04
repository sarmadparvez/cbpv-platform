import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
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

  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  taskRating?: number;

  @IsString()
  @IsOptional()
  taskRatingComment?: string;
}
