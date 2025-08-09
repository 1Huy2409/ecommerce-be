import { MigrationInterface, QueryRunner } from "typeorm";

export class RelationVariantImage21754586725836 implements MigrationInterface {
    name = 'RelationVariantImage21754586725836'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "images" DROP CONSTRAINT IF EXISTS "FK_6c5a4f46286e672374b88d38d39"`);
        await queryRunner.query(`CREATE TABLE "variant_image" ("variant_id" uuid NOT NULL, "image_id" uuid NOT NULL, CONSTRAINT "PK_3b6495f2d08b2b6dccda2490f24" PRIMARY KEY ("variant_id", "image_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_31dd19cfb51d38e113b7d44e46" ON "variant_image" ("variant_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_65d95639ebece1b2c491be9da8" ON "variant_image" ("image_id") `);
        await queryRunner.query(`ALTER TABLE "images" DROP COLUMN "variant_id"`);
        await queryRunner.query(`ALTER TABLE "product_variants" ADD "color" character varying`);
        await queryRunner.query(`ALTER TABLE "variant_image" ADD CONSTRAINT "FK_31dd19cfb51d38e113b7d44e466" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "variant_image" ADD CONSTRAINT "FK_65d95639ebece1b2c491be9da89" FOREIGN KEY ("image_id") REFERENCES "images"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "variant_image" DROP CONSTRAINT "FK_65d95639ebece1b2c491be9da89"`);
        await queryRunner.query(`ALTER TABLE "variant_image" DROP CONSTRAINT "FK_31dd19cfb51d38e113b7d44e466"`);
        await queryRunner.query(`ALTER TABLE "product_variants" DROP COLUMN "color"`);
        await queryRunner.query(`ALTER TABLE "images" ADD "variant_id" uuid`);
        await queryRunner.query(`DROP INDEX "public"."IDX_65d95639ebece1b2c491be9da8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_31dd19cfb51d38e113b7d44e46"`);
        await queryRunner.query(`DROP TABLE "variant_image"`);
        await queryRunner.query(`ALTER TABLE "images" ADD CONSTRAINT "FK_6c5a4f46286e672374b88d38d39" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
