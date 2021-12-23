import { Project, ProjectStatus } from '../entities/project.entity';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { classToPlain, plainToClass } from 'class-transformer';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  description?: string;
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;
  @IsUUID()
  assignedUserId?: string;

  toEntity(): Project {
    const data = classToPlain(this);
    return plainToClass(Project, data);
  }
}
