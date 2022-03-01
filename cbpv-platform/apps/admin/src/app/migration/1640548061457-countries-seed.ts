import { MigrationInterface, QueryRunner } from 'typeorm';
import { yamlToDatabase } from '../data/yaml-to-database';

export class countrySeed1640548061457 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    return yamlToDatabase('country.yaml');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log('reverting of migration not implemented');
  }
}
