import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class GeneratePrototypeNumberResponseDto {
  @IsInt()
  @Min(1)
  @Max(2)
  prototypeNumber: number;
}
