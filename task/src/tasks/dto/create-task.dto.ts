import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { PrototypeFormat, TestType } from '../entities/task.entity';
import { Question } from '../entities/question.entity';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TestType)
  @IsNotEmpty()
  testType: TestType;

  @IsEnum(PrototypeFormat)
  @IsNotEmpty()
  prototypeFormat: PrototypeFormat;

  @IsUrl()
  @IsOptional()
  iframeUrl1?: string;

  @IsUrl()
  @IsOptional()
  iframeUrl2?: string;

  @IsString()
  @IsOptional()
  textualDescription1?: string;

  @IsString()
  @IsOptional()
  textualDescription2?: string;

  @IsInt()
  @Min(18)
  @Max(67)
  @IsOptional()
  minAge?: number;

  @IsInt()
  @Min(18)
  @Max(67)
  @IsOptional()
  maxAge?: number;

  @IsInt()
  @Min(0)
  @Max(49)
  @IsOptional()
  minExperience?: number;

  @IsInt()
  @Min(0)
  @Max(49)
  @IsOptional()
  maxExperience?: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  budget: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  incentive: number;

  @IsUUID()
  @IsNotEmpty()
  projectId: string;

  @IsArray()
  @IsUUID('all', { each: true })
  @IsOptional()
  skills: string[];

  @IsArray()
  @IsUUID('all', { each: true })
  @IsOptional()
  countries: string[];

  @IsArray()
  @IsOptional()
  questions: Question[];
}
