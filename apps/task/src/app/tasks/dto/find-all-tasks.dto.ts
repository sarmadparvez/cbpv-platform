import { IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindAllTasksDto {
  @IsUUID()
  @IsOptional()
  @ApiProperty({
    description: 'The project to which the tasks belongs.',
    required: false,
  })
  projectId: string;
}
