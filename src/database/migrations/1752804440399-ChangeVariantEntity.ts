import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeVariantEntity1752804440399 implements MigrationInterface {
    name = 'ChangeVariantEntity1752804440399'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_variants" DROP COLUMN "imageUrl"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_variants" ADD "imageUrl" text`);
    }

}
