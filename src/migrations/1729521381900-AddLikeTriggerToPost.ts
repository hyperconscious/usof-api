import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLikeTriggerToPost1729521381900 implements MigrationInterface {
  name = 'AddLikeTriggerToPost1729521381900';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TRIGGER update_like_count_after_insert
            AFTER INSERT ON like
            FOR EACH ROW
            BEGIN
              UPDATE post
              SET likes = likes + 1
              WHERE id = NEW.postId;
            END;
          `);

    await queryRunner.query(`
            CREATE TRIGGER update_like_count_after_delete
            AFTER DELETE ON like
            FOR EACH ROW
            BEGIN
              UPDATE post
              SET likes = likes - 1
              WHERE id = OLD.postId;
            END;
          `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS update_like_count_after_insert`,
    );
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS update_like_count_after_delete`,
    );
  }
}
