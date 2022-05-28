import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserReportsService } from './user-reports.service';
import { CreateUserReportDto } from './dto/create-user-report.dto';
import { UpdateUserReportDto } from './dto/update-user-report.dto';
import { ForbiddenError } from '@casl/ability';
import { UserReport } from './entities/user-report.entity';
import * as contextService from 'request-context';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Action } from '../iam/policy';

@ApiTags('user-reports')
@Controller('user-reports')
export class UserReportsController {
  constructor(private readonly reportsService: UserReportsService) {}

  @ApiBearerAuth()
  @Post()
  create(@Body() createReportDto: CreateUserReportDto) {
    // check if user have permission to create a report
    ForbiddenError.from(contextService.get('userAbility')).throwUnlessCan(
      Action.Create,
      UserReport
    );
    return this.reportsService.create(createReportDto);
  }

  @ApiBearerAuth()
  @Get()
  findAll() {
    // check if user have permission to list user-reports
    ForbiddenError.from(contextService.get('userAbility')).throwUnlessCan(
      Action.Create,
      new UserReport()
    );
    return this.reportsService.findAll();
  }

  @ApiBearerAuth()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reportsService.findOne(id);
  }

  @ApiBearerAuth()
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateReportDto: UpdateUserReportDto
  ) {
    return this.reportsService.update(id, updateReportDto);
  }

  @ApiBearerAuth()
  @Patch(':id/disable-feedback')
  disableFeedback(@Param('id') id: string) {
    // check if user have permission to perform this action.
    ForbiddenError.from(contextService.get('userAbility')).throwUnlessCan(
      Action.Manage,
      UserReport
    );
    return this.reportsService.disableFeedback(id);
  }

  @ApiBearerAuth()
  @Patch(':id/enable-feedback')
  enableFeedback(@Param('id') id: string) {
    // check if user have permission to perform this action.
    ForbiddenError.from(contextService.get('userAbility')).throwUnlessCan(
      Action.Manage,
      UserReport
    );
    return this.reportsService.enableFeedback(id);
  }

  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reportsService.remove(id);
  }
}
