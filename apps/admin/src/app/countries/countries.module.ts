import { Module } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CountriesController } from './countries.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from '@cbpv-platform/countries';

@Module({
  imports: [TypeOrmModule.forFeature([Country])],
  controllers: [CountriesController],
  providers: [CountriesService],
})
export class CountriesModule {}
