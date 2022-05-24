import { Controller, Get } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/public.decorator';

@ApiTags('countries')
@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  /**
   * Get a list of all possible Countries in the System.
   */
  @Get()
  @Public()
  findAll() {
    return this.countriesService.findAll();
  }
}
