import { IsString } from 'class-validator';

export class FindNdaUrlResponseDto {
  @IsString()
  ndaUrl: string;
}
