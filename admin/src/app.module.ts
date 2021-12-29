import { Module } from '@nestjs/common';
import { SkillsModule } from './skills/skills.module';
import { getConnectionOptions } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountriesModule } from './countries/countries.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: async () =>
        Object.assign(await getConnectionOptions(), {
          autoLoadEntities: true,
        }),
    }),
    SkillsModule,
    CountriesModule,
    UsersModule,
  ],
})
export class AppModule {}
