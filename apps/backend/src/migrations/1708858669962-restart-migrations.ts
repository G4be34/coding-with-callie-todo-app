import { MigrationInterface, QueryRunner } from 'typeorm';

export class RestartMigrations1708858669962 implements MigrationInterface {
  name = 'RestartMigrations1708858669962';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "todo" ("id" SERIAL NOT NULL, "todo_id" character varying, "description" character varying NOT NULL, "date_completed" TIMESTAMP, "due_date" TIMESTAMP NOT NULL, "date_added" TIMESTAMP NOT NULL, "priority" character varying NOT NULL, "groupId" integer, CONSTRAINT "PK_d429b7114371f6a35c5cb4776a7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "group" ("id" SERIAL NOT NULL, "column_id" character varying NOT NULL, "title" character varying NOT NULL, "position" integer NOT NULL, "userId" integer, CONSTRAINT "PK_256aa0fda9b1de1a73ee0b7106b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "todo" ADD CONSTRAINT "FK_598199a4bf2ce7f0423037af872" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "group" ADD CONSTRAINT "FK_7bec24423f57c3786409cc3cc8d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "group" DROP CONSTRAINT "FK_7bec24423f57c3786409cc3cc8d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "todo" DROP CONSTRAINT "FK_598199a4bf2ce7f0423037af872"`,
    );
    await queryRunner.query(`DROP TABLE "group"`);
    await queryRunner.query(`DROP TABLE "todo"`);
  }
}
