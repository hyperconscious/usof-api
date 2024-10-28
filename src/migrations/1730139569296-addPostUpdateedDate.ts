import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPostUpdateedDate1730139569296 implements MigrationInterface {
  name = 'AddPostUpdateedDate1730139569296';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`post\` ADD \`updatedDate\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`post\` DROP COLUMN \`updatedDate\``);
  }
}
