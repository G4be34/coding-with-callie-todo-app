import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeColumnTypesToInt1716512804172 implements MigrationInterface {
    name = 'ChangeColumnTypesToInt1716512804172'

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
