import { Module } from '@nestjs/common';
import { SkillsModule } from './skills/skills.module';
import { getConnectionOptions } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountriesModule } from './countries/countries.module';
import { UsersModule } from './users/users.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { GlobalExceptionFilter } from '@cbpv-platform/common';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { IamModule } from './iam/iam.module';
import { UserReportsModule } from './user-reports/user-reports.module';

/**
 * To solve single file build artifact issue for nx, for running Typeorm migrations.
 * Solution copied from : https://github.com/typeorm/typeorm/issues/5458#issuecomment-770453233
 */
const contexts = (require as any).context('./migration/', true, /\.ts$/);
const migrations = contexts
  .keys()
  .map((modulePath) => contexts(modulePath))
  .reduce((result, migrationModule) => {
    return Object.assign(result, migrationModule);
  });

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
            migrations: Object.values(migrations),
          };
        }
        return Object.assign(await getConnectionOptions(), {
          autoLoadEntities: true,
          migrationsRun: true,
          migrations: Object.values(migrations),
        });
      },
    }),
    SkillsModule,
    CountriesModule,
    AuthModule,
    UsersModule,
    IamModule,
    UserReportsModule,
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
