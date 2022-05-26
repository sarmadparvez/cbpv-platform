import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateTaskRequestDto } from './create-task-request.dto';

export class UpdateTaskRequestDto extends PartialType(
  OmitType(CreateTaskRequestDto, ['taskId'] as const)
) {}
