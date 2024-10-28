import { MigrationInterface, QueryRunner } from 'typeorm';

export class Tables1729776100085 implements MigrationInterface {
  name = 'Tables1729776100085';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`login\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`full_name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`verified\` tinyint NOT NULL DEFAULT 0, \`avatar\` varchar(255) NOT NULL DEFAULT '', \`publisher_rating\` int NOT NULL DEFAULT '0', \`commentator_rating\` int NOT NULL DEFAULT '0', \`role\` enum ('admin', 'user') NOT NULL DEFAULT 'user', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_a62473490b3e4578fd683235c5\` (\`login\`), UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), UNIQUE INDEX \`IDX_bec1a7d56ad6e762a1e2ce527b\` (\`login\`, \`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`category\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`description\` text NULL, UNIQUE INDEX \`IDX_9f16dbbf263b0af0f03637fa7b\` (\`title\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`comment\` (\`id\` int NOT NULL AUTO_INCREMENT, \`publish_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`content\` text NOT NULL, \`likes_count\` int NOT NULL DEFAULT '0', \`dislikes_count\` int NOT NULL DEFAULT '0', \`user_id\` int NULL, \`post_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`post\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`publishDate\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`status\` enum ('active', 'inactive', 'locked') NOT NULL DEFAULT 'inactive', \`content\` text NOT NULL, \`likes_count\` int NOT NULL DEFAULT '0', \`dislikes_count\` int NOT NULL DEFAULT '0', \`comments_count\` int NOT NULL DEFAULT '0', \`user_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`like\` (\`id\` int NOT NULL AUTO_INCREMENT, \`publish_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`entity_type\` varchar(255) NOT NULL DEFAULT 'post', \`type\` varchar(255) NOT NULL DEFAULT 'like', \`user_id\` int NULL, \`post_id\` int NULL, \`comment_id\` int NULL, UNIQUE INDEX \`IDX_de18085ee8cf871497f08209d2\` (\`user_id\`, \`post_id\`, \`comment_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`post_categories_category\` (\`postId\` int NOT NULL, \`categoryId\` int NOT NULL, INDEX \`IDX_93b566d522b73cb8bc46f7405b\` (\`postId\`), INDEX \`IDX_a5e63f80ca58e7296d5864bd2d\` (\`categoryId\`), PRIMARY KEY (\`postId\`, \`categoryId\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_bbfe153fa60aa06483ed35ff4a7\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_8aa21186314ce53c5b61a0e8c93\` FOREIGN KEY (\`post_id\`) REFERENCES \`post\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`post\` ADD CONSTRAINT \`FK_52378a74ae3724bcab44036645b\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`like\` ADD CONSTRAINT \`FK_4356ac2f9519c7404a2869f1691\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`like\` ADD CONSTRAINT \`FK_d41caa70371e578e2a4791a88ae\` FOREIGN KEY (\`post_id\`) REFERENCES \`post\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`like\` ADD CONSTRAINT \`FK_307553e232b4620fde327c59eb5\` FOREIGN KEY (\`comment_id\`) REFERENCES \`comment\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`post_categories_category\` ADD CONSTRAINT \`FK_93b566d522b73cb8bc46f7405bd\` FOREIGN KEY (\`postId\`) REFERENCES \`post\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`post_categories_category\` ADD CONSTRAINT \`FK_a5e63f80ca58e7296d5864bd2d3\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`post_categories_category\` DROP FOREIGN KEY \`FK_a5e63f80ca58e7296d5864bd2d3\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`post_categories_category\` DROP FOREIGN KEY \`FK_93b566d522b73cb8bc46f7405bd\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`like\` DROP FOREIGN KEY \`FK_307553e232b4620fde327c59eb5\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`like\` DROP FOREIGN KEY \`FK_d41caa70371e578e2a4791a88ae\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`like\` DROP FOREIGN KEY \`FK_4356ac2f9519c7404a2869f1691\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`post\` DROP FOREIGN KEY \`FK_52378a74ae3724bcab44036645b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_8aa21186314ce53c5b61a0e8c93\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_bbfe153fa60aa06483ed35ff4a7\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_a5e63f80ca58e7296d5864bd2d\` ON \`post_categories_category\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_93b566d522b73cb8bc46f7405b\` ON \`post_categories_category\``,
    );
    await queryRunner.query(`DROP TABLE \`post_categories_category\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_de18085ee8cf871497f08209d2\` ON \`like\``,
    );
    await queryRunner.query(`DROP TABLE \`like\``);
    await queryRunner.query(`DROP TABLE \`post\``);
    await queryRunner.query(`DROP TABLE \`comment\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_9f16dbbf263b0af0f03637fa7b\` ON \`category\``,
    );
    await queryRunner.query(`DROP TABLE \`category\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_bec1a7d56ad6e762a1e2ce527b\` ON \`user\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_a62473490b3e4578fd683235c5\` ON \`user\``,
    );
    await queryRunner.query(`DROP TABLE \`user\``);
  }
}
