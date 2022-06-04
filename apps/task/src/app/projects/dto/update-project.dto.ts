import { PartialType } from '@nestjs/swagger';
import { CreateProjectDto } from './create-project.dto';
import { ProjectStatus } from '../entities/project.entity';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;
}
