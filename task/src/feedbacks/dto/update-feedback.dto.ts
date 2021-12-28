import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateFeedbackDto } from './create-feedback.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { PaymentStatus } from '../entities/feedback.entity';

export class UpdateFeedbackDto extends PartialType(
  OmitType(CreateFeedbackDto, ['taskId'] as const),
) {
  @IsEnum(PaymentStatus)
  @IsOptional()
  paymentStatus?: PaymentStatus;
}
