import { ArrayNotEmpty, IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class BatchGetUserInfoDto {
  @IsArray()
  @IsUUID('all', { each: true })
  @IsNotEmpty()
  @ArrayNotEmpty()
  ids: string[];
}
