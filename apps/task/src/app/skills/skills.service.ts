import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';
import { Timeout } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Skill } from '@cbpv-platform/skills';

@Injectable()
export class SkillsService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
    @InjectRepository(Skill)
    private skillRepository: Repository<Skill>
  ) {}

  /**
   * Fetching Skills from the Admin service and saving in database
   * Called once whenever application runs. Saves skills in database only if they are not already saved
   * */
  @Timeout(0)
  async fetchAndSaveSkills() {
    const skill = await this.skillRepository.findOne();
    if (skill) {
      Logger.debug('skills already available in database.');
      return;
    }
    const adminAPI = this.configService.get<string>('ADMIN_API');
    if (adminAPI) {
      try {
        const response = await firstValueFrom(
          this.httpService.get<Skill[]>(`${adminAPI}/skills`)
        );
        const skills = response.data;
        this.skillRepository.save(skills);
        Logger.debug('Skills saved in database');
      } catch (err) {
        Logger.error(`failed to fetch and save skills ${err}`);
      }
    }
  }
}
