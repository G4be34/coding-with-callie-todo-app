import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeColumnTypes1716495830543 implements MigrationInterface {
    name = 'ChangeColumnTypes1716495830543'

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
