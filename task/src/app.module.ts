import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProjectsModule } from './projects/projects.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnectionOptions } from 'typeorm';
import { GlobalExceptionFilter } from './common/global-exception-filter';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { TasksModule } from './tasks/tasks.module';
import { SkillsModule } from './skills/skills.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CountriesModule } from './countries/countries.module';
import { FeedbacksModule } from './feedbacks/feedbacks.module';
import cloudinary from './config/cloudinary';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { UsersModule } from './users/users.module';
import { IamModule } from './iam/iam.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [cloudinary] }),
    TypeOrmModule.forRootAsync({
      useFactory: async () =>
        Object.assign(await getConnectionOptions(), {
          autoLoadEntities: true,
        }),
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    ProjectsModule,
    TasksModule,
    SkillsModule,
    CountriesModule,
    FeedbacksModule,
    UsersModule,
    IamModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
