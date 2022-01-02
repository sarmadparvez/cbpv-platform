import { IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindAllFeedbackDto {
  @IsUUID()
  @IsOptional()
  @ApiProperty({
    description: 'The task to which the feedbacks belong.',
    required: false,
  })
  taskId: string;
}
