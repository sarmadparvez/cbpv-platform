import { Controller, Get } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('countries')
@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  /**
   * Get all countries.
   */
  @Get()
  findAll() {
    return this.countriesService.findAll();
  }
}
