import { MigrationInterface, QueryRunner } from "typeorm";

export class FixNullableColumns1716513867730 implements MigrationInterface {
    name = 'FixNullableColumns1716513867730'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todo" DROP COLUMN "date_completed"`);
        await queryRunner.query(`ALTER TABLE "todo" ADD "date_completed" integer`);
        await queryRunner.query(`ALTER TABLE "todo" ALTER COLUMN "due_date" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todo" ALTER COLUMN "due_date" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "todo" DROP COLUMN "date_completed"`);
        await queryRunner.query(`ALTER TABLE "todo" ADD "date_completed" TIMESTAMP`);
    }

}
