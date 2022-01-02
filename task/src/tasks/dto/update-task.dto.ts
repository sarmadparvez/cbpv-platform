import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends PartialType(
  OmitType(CreateTaskDto, [
    'projectId',
    'prototypeFormat',
    'testType',
  ] as const),
) {}
