import { Controller, Get } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('skills')
@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  /**
   * Get all skills.
   */
  @Get()
  findAll() {
    return this.skillsService.findAll();
  }
}
