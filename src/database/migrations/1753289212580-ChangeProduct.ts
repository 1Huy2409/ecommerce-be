import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeProduct1753289212580 implements MigrationInterface {
    name = 'ChangeProduct1753289212580'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ADD "isLocked" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "product_variants" ADD "isLocked" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_variants" DROP COLUMN "isLocked"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "isLocked"`);
    }

}
