import { MigrationInterface, QueryRunner } from "typeorm";

export class CascadeCart1754891782935 implements MigrationInterface {
    name = 'CascadeCart1754891782935'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "carts" DROP CONSTRAINT "FK_69828a178f152f157dcf2f70a89"`);
        await queryRunner.query(`ALTER TABLE "carts" ADD CONSTRAINT "FK_69828a178f152f157dcf2f70a89" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "carts" DROP CONSTRAINT "FK_69828a178f152f157dcf2f70a89"`);
        await queryRunner.query(`ALTER TABLE "carts" ADD CONSTRAINT "FK_69828a178f152f157dcf2f70a89" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
