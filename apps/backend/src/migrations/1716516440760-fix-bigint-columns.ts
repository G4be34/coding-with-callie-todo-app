import { MigrationInterface, QueryRunner } from "typeorm";

export class FixBigintColumns1716516440760 implements MigrationInterface {
    name = 'FixBigintColumns1716516440760'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todo" DROP COLUMN "date_completed"`);
        await queryRunner.query(`ALTER TABLE "todo" ADD "date_completed" character varying`);
        await queryRunner.query(`ALTER TABLE "todo" DROP COLUMN "due_date"`);
        await queryRunner.query(`ALTER TABLE "todo" ADD "due_date" character varying`);
        await queryRunner.query(`ALTER TABLE "todo" DROP COLUMN "date_added"`);
        await queryRunner.query(`ALTER TABLE "todo" ADD "date_added" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todo" DROP COLUMN "date_added"`);
        await queryRunner.query(`ALTER TABLE "todo" ADD "date_added" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "todo" DROP COLUMN "due_date"`);
        await queryRunner.query(`ALTER TABLE "todo" ADD "due_date" integer`);
        await queryRunner.query(`ALTER TABLE "todo" DROP COLUMN "date_completed"`);
        await queryRunner.query(`ALTER TABLE "todo" ADD "date_completed" integer`);
    }

}
