import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableUser1729012763177 implements MigrationInterface {
  name = 'CreateTableUser1729012763177';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`login\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`full_name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`profile_picture\` varchar(255) NOT NULL, \`rating\` int NOT NULL, \`role\` enum ('admin', 'user') NOT NULL DEFAULT 'user', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_a62473490b3e4578fd683235c5\` (\`login\`), UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), UNIQUE INDEX \`IDX_bec1a7d56ad6e762a1e2ce527b\` (\`login\`, \`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
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
