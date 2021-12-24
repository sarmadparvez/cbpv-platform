import { Project, ProjectStatus } from '../entities/project.entity';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  @IsOptional()
  description?: string;
  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;
  @IsUUID()
  @IsOptional()
  assignedUserId?: string;
}
