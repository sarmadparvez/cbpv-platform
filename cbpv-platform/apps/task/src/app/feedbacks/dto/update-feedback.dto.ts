import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateFeedbackDto } from './create-feedback.dto';

export class UpdateFeedbackDto extends PartialType(
  OmitType(CreateFeedbackDto, ['taskId'] as const),
) {}
