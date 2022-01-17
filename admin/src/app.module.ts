import { Module } from '@nestjs/common';
import { SkillsModule } from './skills/skills.module';
import { getConnectionOptions } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountriesModule } from './countries/countries.module';
import { UsersModule } from './users/users.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { GlobalExceptionFilter } from './common/global-exception-filter';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { IamModule } from './iam/iam.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
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
            migrationsRun: true,
            migrations: ['dist/migration/**/*.js'],
          };
        }
        return Object.assign(await getConnectionOptions(), {
          autoLoadEntities: true,
          migrationsRun: true,
        });
      },
    }),
    SkillsModule,
    CountriesModule,
    AuthModule,
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
