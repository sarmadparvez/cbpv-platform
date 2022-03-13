import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class RateFeedbackDto {
  @IsInt()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  feedbackRating: number;

  @IsString()
  @IsOptional()
  feedbackRatingComment?: string;
}
