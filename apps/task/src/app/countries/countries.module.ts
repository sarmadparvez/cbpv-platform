import { Module } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from './entities/country.entity';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([Country]), ConfigModule, HttpModule],
  providers: [CountriesService],
})
export class CountriesModule {}
