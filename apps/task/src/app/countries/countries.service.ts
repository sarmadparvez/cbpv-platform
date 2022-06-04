import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Timeout } from '@nestjs/schedule';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Country } from '@cbpv-platform/countries';

@Injectable()
export class CountriesService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
    @InjectRepository(Country)
    private countryRepository: Repository<Country>
  ) {}

  /**
   * Fetching Countries from the Admin service and saving in database
   * Called once whenever application runs. Saves Countries in database only if they are not already saved
   * */
  @Timeout(0)
  async fetchAndSaveCountries() {
    const country = await this.countryRepository.findOne();
    if (country) {
      Logger.debug('countries already available in database.');
      return;
    }
    const adminAPI = this.configService.get<string>('ADMIN_API');
    if (adminAPI) {
      try {
        const response = await firstValueFrom(
          this.httpService.get<Country[]>(`${adminAPI}/countries`)
        );
        const countries = response.data;
        this.countryRepository.save(countries);
        Logger.debug('Countries saved in database');
      } catch (err) {
        Logger.error(`failed to fetch and save countries ${err}`);
      }
    }
  }
}
