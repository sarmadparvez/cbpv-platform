import { Module } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { Skill } from '@cbpv-platform/skills';

@Module({
  imports: [TypeOrmModule.forFeature([Skill]), ConfigModule, HttpModule],
  providers: [SkillsService],
})
export class SkillsModule {}
