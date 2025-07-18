import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnImage1752830934805 implements MigrationInterface {
    name = 'AddColumnImage1752830934805'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "images" ADD "fileName" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "images" ADD "publicId" character varying(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "images" DROP COLUMN "publicId"`);
        await queryRunner.query(`ALTER TABLE "images" DROP COLUMN "fileName"`);
    }

}
