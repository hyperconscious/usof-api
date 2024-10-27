import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFavourite1730057187947 implements MigrationInterface {
  name = 'AddFavourite1730057187947';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`favorite\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user_id\` int NULL, \`post_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`favorite\` ADD CONSTRAINT \`FK_e666fc7cc4c80fba1944daa1a74\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`favorite\` ADD CONSTRAINT \`FK_2643df4f83c97f24e261cbee403\` FOREIGN KEY (\`post_id\`) REFERENCES \`post\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`favorite\` DROP FOREIGN KEY \`FK_2643df4f83c97f24e261cbee403\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`favorite\` DROP FOREIGN KEY \`FK_e666fc7cc4c80fba1944daa1a74\``,
    );
    await queryRunner.query(`DROP TABLE \`favorite\``);
  }
}
