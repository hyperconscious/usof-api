import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCommentTriggers1729776892255 implements MigrationInterface {
  name = 'AddCommentTriggers1729776892255';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TRIGGER update_comment_count_on_insert
            AFTER INSERT ON comment
            FOR EACH ROW
            BEGIN
                UPDATE post
                SET comments_count = comments_count + 1
                WHERE id = NEW.post_id;
            END;
        `);

    await queryRunner.query(`
            CREATE TRIGGER update_comment_count_on_delete
            AFTER DELETE ON comment
            FOR EACH ROW
            BEGIN
                UPDATE post
                SET comments_count = comments_count - 1
                WHERE id = OLD.post_id;
            END;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS update_comment_count_on_insert;`,
    );
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS update_comment_count_on_delete;`,
    );
  }
}
