import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class RateTaskDto {
  @IsInt()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  taskRating: number;

  @IsString()
  @IsOptional()
  taskRatingComment?: string;
}
