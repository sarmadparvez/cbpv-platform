import { MigrationInterface, QueryRunner } from 'typeorm';
import { yamlToDatabase } from '../data/yaml-to-database';

export class skillsSeed1640532247325 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    return yamlToDatabase('skill.yaml');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log('reverting of migration not implemented');
  }
}
