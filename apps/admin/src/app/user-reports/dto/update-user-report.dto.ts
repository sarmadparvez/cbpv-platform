import { PartialType } from '@nestjs/swagger';
import { CreateUserReportDto } from './create-user-report.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { UserReportStatus } from '../entities/user-report.entity';

export class UpdateUserReportDto extends PartialType(CreateUserReportDto) {
  @IsEnum(UserReportStatus)
  @IsOptional()
  reportStatus: UserReportStatus;
}
