import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateFeedbackDto } from './create-feedback.dto';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateFeedbackDto extends PartialType(
  OmitType(CreateFeedbackDto, ['taskId'] as const),
) {}
