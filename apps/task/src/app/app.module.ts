import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProjectsModule } from './projects/projects.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnectionOptions } from 'typeorm';
import { GlobalExceptionFilter } from '@cbpv-platform/common';
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
import { TaskRequestsModule } from './task-requests/task-requests.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [cloudinary] }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        // for production, we have a remote database
        if (process.env.DATABASE_URL) {
          return {
            url: process.env.DATABASE_URL,
            type: 'postgres',
            synchronize: true,
            extra: { ssl: { rejectUnauthorized: false } },
            autoLoadEntities: true,
          };
        }
        return Object.assign(await getConnectionOptions(), {
          autoLoadEntities: true,
          // extra: { ssl: { rejectUnauthorized: false } },
        });
      },
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    ProjectsModule,
    TasksModule,
    TaskRequestsModule,
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
