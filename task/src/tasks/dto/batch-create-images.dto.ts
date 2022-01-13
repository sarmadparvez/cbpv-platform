import { IsArray, IsNotEmpty } from 'class-validator';
import { Image } from '../entities/image.entity';

export class BatchCreateImagesDto {
  @IsArray()
  @IsNotEmpty()
  images: Image[];
}
