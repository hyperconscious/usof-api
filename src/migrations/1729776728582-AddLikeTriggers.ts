import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLikeTriggers1729776728582 implements MigrationInterface {
  name = 'AddLikeTriggers1729776728582';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TRIGGER \`after_like_insert\` AFTER INSERT ON \`like\` FOR EACH ROW
            BEGIN
                IF NEW.type = 'like' THEN
                    IF NEW.entity_type = 'post' THEN
                        UPDATE post SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
                    ELSEIF NEW.entity_type = 'comment' THEN
                        UPDATE comment SET likes_count = likes_count + 1 WHERE id = NEW.comment_id;
                    END IF;
                ELSEIF NEW.type = 'dislike' THEN
                    IF NEW.entity_type = 'post' THEN
                        UPDATE post SET dislikes_count = dislikes_count + 1 WHERE id = NEW.post_id;
                    ELSEIF NEW.entity_type = 'comment' THEN
                        UPDATE comment SET dislikes_count = dislikes_count + 1 WHERE id = NEW.comment_id;
                    END IF;
                END IF;
                CALL update_rating(NEW.user_id, NEW.entity_type);
            END;
        `);

    await queryRunner.query(`
            CREATE TRIGGER \`after_like_delete\` AFTER DELETE ON \`like\` FOR EACH ROW
            BEGIN
                IF OLD.type = 'like' THEN
                    IF OLD.entity_type = 'post' THEN
                        UPDATE post SET likes_count = likes_count - 1 WHERE id = OLD.post_id;
                    ELSEIF OLD.entity_type = 'comment' THEN
                        UPDATE comment SET likes_count = likes_count - 1 WHERE id = OLD.comment_id;
                    END IF;
                ELSEIF OLD.type = 'dislike' THEN
                    IF OLD.entity_type = 'post' THEN
                        UPDATE post SET dislikes_count = dislikes_count - 1 WHERE id = OLD.post_id;
                    ELSEIF OLD.entity_type = 'comment' THEN
                        UPDATE comment SET dislikes_count = dislikes_count - 1 WHERE id = OLD.comment_id;
                    END IF;
                END IF;
                CALL update_rating(OLD.user_id, OLD.entity_type);
            END;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER IF EXISTS \`after_like_insert\``);
    await queryRunner.query(`DROP TRIGGER IF EXISTS \`after_like_delete\``);
  }
}
