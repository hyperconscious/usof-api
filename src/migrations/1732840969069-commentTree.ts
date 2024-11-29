import { MigrationInterface, QueryRunner } from 'typeorm';

export class CommentTree1732840969069 implements MigrationInterface {
  name = 'CommentTree1732840969069';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`comment\` ADD \`parent_comment_id\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_ac69bddf8202b7c0752d9dc8f32\` FOREIGN KEY (\`parent_comment_id\`) REFERENCES \`comment\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_ac69bddf8202b7c0752d9dc8f32\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`comment\` DROP COLUMN \`parent_comment_id\``,
    );
  }
}
