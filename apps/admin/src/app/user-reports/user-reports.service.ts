import { Injectable } from '@nestjs/common';
import { CreateUserReportDto } from './dto/create-user-report.dto';
import { UpdateUserReportDto } from './dto/update-user-report.dto';
import { classToPlain, plainToClass } from 'class-transformer';
import {
  UserReport,
  UserReportAction,
  UserReportStatus,
} from './entities/user-report.entity';
import * as contextService from 'request-context';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ForbiddenError } from '@casl/ability';
import { Action } from '../iam/policy';
import { User } from '../users/entities/user.entity';
import { use } from 'passport';

@Injectable()
export class UserReportsService {
  constructor(
    @InjectRepository(UserReport)
    private userReportRepository: Repository<UserReport>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async create(createReportDto: CreateUserReportDto) {
    // Implement idempotency.
    const existingReport = await this.userReportRepository.findOne({
      reportedUserId: createReportDto.reportedUserId,
      feedbackId: createReportDto.feedbackId,
      taskId: createReportDto.taskId,
    });

    const userReport = userReportDtoToEntity(createReportDto);
    userReport.reporterId = contextService.get('user')?.id;
    userReport.reportStatus = UserReportStatus.Open;
    if (existingReport) {
      userReport.id = existingReport.id;
    }
    return this.userReportRepository.save(userReport);
  }

  findAll() {
    return this.userReportRepository.find();
  }

  async findOne(id: string) {
    const userReport = await this.userReportRepository.findOneOrFail(id);
    // check if user have permission to read this.
    ForbiddenError.from(contextService.get('userAbility')).throwUnlessCan(
      Action.Read,
      userReport
    );
    return userReport;
  }

  async update(id: string, updateReportDto: UpdateUserReportDto) {
    const existingReport = await this.userReportRepository.findOneOrFail(id);
    // check if user have permission to read this.
    ForbiddenError.from(contextService.get('userAbility')).throwUnlessCan(
      Action.Update,
      existingReport
    );

    const userReport = userReportDtoToEntity(updateReportDto);
    await this.userReportRepository.update(id, userReport);
    return this.userReportRepository.findOne(id);
  }

  async remove(id: string) {
    const existingReport = await this.userReportRepository.findOneOrFail(id);
    // check if user have permission to read this.
    ForbiddenError.from(contextService.get('userAbility')).throwUnlessCan(
      Action.Delete,
      existingReport
    );
    return this.userReportRepository.delete(id);
  }

  async disableFeedback(id: string) {
    const userReport = await this.userReportRepository.findOneOrFail(id);
    await this.userRepository.update(userReport.reportedUserId, {
      feedbackDisabled: true,
    });
    return this.userReportRepository.update(
      {
        reportedUserId: userReport.reportedUserId,
      },
      {
        reportAction: UserReportAction.FeedbackDisabled,
      }
    );
  }

  async enableFeedback(id: string) {
    const userReport = await this.userReportRepository.findOneOrFail(id);
    await this.userRepository.update(userReport.reportedUserId, {
      feedbackDisabled: false,
    });
    return this.userReportRepository.update(
      {
        reportedUserId: userReport.reportedUserId,
      },
      {
        reportAction: UserReportAction.FeedbackEnabled,
      }
    );
  }
}

function userReportDtoToEntity(
  dto: CreateUserReportDto | UpdateUserReportDto
): UserReport {
  const data = classToPlain(dto);
  return plainToClass(UserReport, data);
}
