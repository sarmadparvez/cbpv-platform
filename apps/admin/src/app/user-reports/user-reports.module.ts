import { Module } from '@nestjs/common';
import { UserReportsService } from './user-reports.service';
import { UserReportsController } from './user-reports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserReport } from './entities/user-report.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserReport, User])],
  controllers: [UserReportsController],
  providers: [UserReportsService],
})
export class UserReportsModule {}
