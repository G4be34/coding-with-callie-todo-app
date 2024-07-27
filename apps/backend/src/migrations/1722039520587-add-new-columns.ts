import { MigrationInterface, QueryRunner } from "typeorm";

export class FixBigintColumns21722039520587 implements MigrationInterface {
    name = 'FixBigintColumns21722039520587'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "group" ADD "sort" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "group" DROP COLUMN "sort"`);
    }

}
