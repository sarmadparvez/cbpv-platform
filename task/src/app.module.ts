import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProjectsModule } from './projects/projects.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnectionOptions } from 'typeorm';
import { GlobalExceptionFilter } from './common/global-exception-filter';
import { APP_FILTER } from '@nestjs/core';
import { TasksModule } from './tasks/tasks.module';
import { SkillsModule } from './skills/skills.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CountriesModule } from './countries/countries.module';
import { FeedbacksModule } from './feedbacks/feedbacks.module';
import cloudinary from './config/cloudinary';

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
    ProjectsModule,
    TasksModule,
    SkillsModule,
    CountriesModule,
    FeedbacksModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
