import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class RateFeedbackDto {
  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  feedbackRating?: number;

  @IsString()
  @IsOptional()
  feedbackRatingComment?: string;
}
