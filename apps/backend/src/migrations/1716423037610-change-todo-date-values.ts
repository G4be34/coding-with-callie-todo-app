import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeTodoDateValues1716423037610 implements MigrationInterface {
    name = 'ChangeTodoDateValues1716423037610'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todo" DROP COLUMN "due_date"`);
        await queryRunner.query(`ALTER TABLE "todo" ADD "due_date" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "todo" DROP COLUMN "date_added"`);
        await queryRunner.query(`ALTER TABLE "todo" ADD "date_added" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todo" DROP COLUMN "date_added"`);
        await queryRunner.query(`ALTER TABLE "todo" ADD "date_added" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "todo" DROP COLUMN "due_date"`);
        await queryRunner.query(`ALTER TABLE "todo" ADD "due_date" TIMESTAMP NOT NULL`);
    }

}
