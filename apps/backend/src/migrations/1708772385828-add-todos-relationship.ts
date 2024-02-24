import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTodosRelationship1708772385828 implements MigrationInterface {
    name = 'AddTodosRelationship1708772385828'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "group" ("id" SERIAL NOT NULL, "column_id" integer NOT NULL, "title" character varying NOT NULL, "position" integer NOT NULL, CONSTRAINT "PK_256aa0fda9b1de1a73ee0b7106b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "todo" DROP COLUMN "completed"`);
        await queryRunner.query(`ALTER TABLE "todo" DROP COLUMN "labels"`);
        await queryRunner.query(`ALTER TABLE "todo" DROP COLUMN "date"`);
        await queryRunner.query(`ALTER TABLE "todo" DROP COLUMN "group"`);
        await queryRunner.query(`ALTER TABLE "todo" ADD "todo_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "todo" ADD "date_completed" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "todo" ADD "due_date" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "todo" ADD "date_added" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "todo" ADD "groupId" integer`);
        await queryRunner.query(`ALTER TABLE "todo" ADD CONSTRAINT "FK_598199a4bf2ce7f0423037af872" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todo" DROP CONSTRAINT "FK_598199a4bf2ce7f0423037af872"`);
        await queryRunner.query(`ALTER TABLE "todo" DROP COLUMN "groupId"`);
        await queryRunner.query(`ALTER TABLE "todo" DROP COLUMN "date_added"`);
        await queryRunner.query(`ALTER TABLE "todo" DROP COLUMN "due_date"`);
        await queryRunner.query(`ALTER TABLE "todo" DROP COLUMN "date_completed"`);
        await queryRunner.query(`ALTER TABLE "todo" DROP COLUMN "todo_id"`);
        await queryRunner.query(`ALTER TABLE "todo" ADD "group" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "todo" ADD "date" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "todo" ADD "labels" text array NOT NULL`);
        await queryRunner.query(`ALTER TABLE "todo" ADD "completed" boolean NOT NULL`);
        await queryRunner.query(`DROP TABLE "group"`);
    }

}
