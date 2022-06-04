import { Module } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { Country } from '@cbpv-platform/countries';

@Module({
  imports: [TypeOrmModule.forFeature([Country]), ConfigModule, HttpModule],
  providers: [CountriesService],
})
export class CountriesModule {}
