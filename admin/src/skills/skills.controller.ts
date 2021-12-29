import { Controller, Get } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/public.decorator';

@ApiTags('skills')
@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  /**
   * Get all skills.
   */
  @Get()
  @Public()
  findAll() {
    return this.skillsService.findAll();
  }
}
