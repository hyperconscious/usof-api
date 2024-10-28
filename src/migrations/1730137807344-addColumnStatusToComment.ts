import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnStatusToComment1730137807344
  implements MigrationInterface
{
  name = 'AddColumnStatusToComment1730137807344';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`comment\` ADD \`status\` enum ('active', 'inactive') NOT NULL DEFAULT 'active'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`comment\` DROP COLUMN \`status\``);
  }
}
