import { MigrationInterface, QueryRunner } from "typeorm";

export class FixBigintColumns21716932965173 implements MigrationInterface {
    name = 'FixBigintColumns21716932965173'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todo" DROP COLUMN "date_completed"`);
        await queryRunner.query(`ALTER TABLE "todo" ADD "date_completed" bigint`);
        await queryRunner.query(`ALTER TABLE "todo" DROP COLUMN "due_date"`);
        await queryRunner.query(`ALTER TABLE "todo" ADD "due_date" bigint`);
        await queryRunner.query(`ALTER TABLE "todo" DROP COLUMN "date_added"`);
        await queryRunner.query(`ALTER TABLE "todo" ADD "date_added" bigint NOT NULL`);
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
