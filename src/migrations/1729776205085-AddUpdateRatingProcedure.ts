import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUpdateRatingProcedure1729776205085
  implements MigrationInterface
{
  name = 'AddUpdateRatingProcedure1729776205085';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE PROCEDURE update_rating(
                user_id INT,
                rating_type ENUM('post', 'comment')
            )
            BEGIN
                DECLARE like_count INT;
                DECLARE dislike_count INT;
                DECLARE new_rating DECIMAL(3, 1);

                IF rating_type = 'post' THEN
                    SELECT SUM(likes_count), SUM(dislikes_count)
                    INTO like_count, dislike_count
                    FROM post
                    WHERE user_id = user_id;

                    SET new_rating = ROUND((9.0 * like_count / (like_count + dislike_count + 1)), 2);

                    UPDATE user
                    SET publisher_rating = LEAST(10.0, GREATEST(1.0, new_rating))
                    WHERE id = user_id;

                ELSEIF rating_type = 'comment' THEN
                    SELECT SUM(likes_count), SUM(dislikes_count)
                    INTO like_count, dislike_count
                    FROM comment
                    WHERE user_id = user_id;

                    SET new_rating = ROUND((9.0 * like_count / (like_count + dislike_count + 1)), 2);

                    UPDATE user
                    SET commentator_rating = LEAST(10.0, GREATEST(1.0, new_rating))
                    WHERE id = user_id;
                END IF;
            END;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP PROCEDURE IF EXISTS update_rating;
        `);
  }
}
