import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFiles1729966704846 implements MigrationInterface {
  name = 'AddFiles1729966704846';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`post\` ADD \`images\` text NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`post\` DROP COLUMN \`images\``);
  }
}
