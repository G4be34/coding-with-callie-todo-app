import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnToName1706929040750 implements MigrationInterface {
    name = 'AddColumnToName1706929040750'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "name" TO "username"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "username" TO "name"`);
    }

}
