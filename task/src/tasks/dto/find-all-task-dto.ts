import { IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindAllTaskDto {
  @IsUUID()
  @IsOptional()
  @ApiProperty({
    description: 'The project to which this task belongs.',
    required: false,
  })
  projectId: string;
}
