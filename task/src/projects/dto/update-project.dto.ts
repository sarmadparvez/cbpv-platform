import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';
import { Project } from '../entities/project.entity';
import { classToPlain, plainToClass } from 'class-transformer';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {}
