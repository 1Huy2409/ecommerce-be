import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateImageEntity1752775193801 implements MigrationInterface {
    name = 'UpdateImageEntity1752775193801'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "images" ADD "variant_id" uuid`);
        await queryRunner.query(`ALTER TABLE "images" ADD CONSTRAINT "FK_6c5a4f46286e672374b88d38d39" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "images" DROP CONSTRAINT "FK_6c5a4f46286e672374b88d38d39"`);
        await queryRunner.query(`ALTER TABLE "images" DROP COLUMN "variant_id"`);
    }

}
