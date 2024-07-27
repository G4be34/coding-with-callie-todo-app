import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNewColumnsFix1722040795954 implements MigrationInterface {
    name = 'AddNewColumnsFix1722040795954'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "group" ADD "sort" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "group" DROP COLUMN "sort"`);
    }

}
