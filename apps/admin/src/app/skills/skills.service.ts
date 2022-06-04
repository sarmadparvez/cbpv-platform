import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Skill } from '@cbpv-platform/skills';

@Injectable()
export class SkillsService {
  // temporarily return just these skills for evaluation
  whitelistskills = [
    'afe60a49-92f7-4ae8-9c69-0035ac4c2b6e',
    '1fe74128-2d68-4414-b9b9-c7fdf5189267',
    'a00b0213-30e7-4ee2-b14c-7e5c889d9e0b',
    'd5795f2c-5369-4b67-9513-372cd53af0e6',
    '634dce96-8c20-4642-b56e-8225c34ead3b',
  ];
  constructor(
    @InjectRepository(Skill)
    private skillRepository: Repository<Skill>
  ) {}

  findAll() {
    return this.skillRepository.find({
      where: {
        id: In(this.whitelistskills),
      },
    });
  }
}
