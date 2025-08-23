import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCancelRequest1755875055233 implements MigrationInterface {
    name = 'AddCancelRequest1755875055233'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."order_cancel_requests_status_enum" AS ENUM('pending', 'rejecte', 'approve')`);
        await queryRunner.query(`CREATE TABLE "order_cancel_requests" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "reason" character varying(100) NOT NULL, "adminNote" character varying(100) NOT NULL, "status" "public"."order_cancel_requests_status_enum" NOT NULL DEFAULT 'pending', "processedAt" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "order_id" uuid NOT NULL, "requested_by" uuid NOT NULL, "processed_by" uuid, CONSTRAINT "PK_79eb2570ba956a6883b59ea4eb9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "order_cancel_requests" ADD CONSTRAINT "FK_8763873126fda4bdd6d3cf9cf9d" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_cancel_requests" ADD CONSTRAINT "FK_83b7448a907dacd290659b008cb" FOREIGN KEY ("requested_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_cancel_requests" ADD CONSTRAINT "FK_60e37dac6e03f81d5a7b7f3b378" FOREIGN KEY ("processed_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_cancel_requests" DROP CONSTRAINT "FK_60e37dac6e03f81d5a7b7f3b378"`);
        await queryRunner.query(`ALTER TABLE "order_cancel_requests" DROP CONSTRAINT "FK_83b7448a907dacd290659b008cb"`);
        await queryRunner.query(`ALTER TABLE "order_cancel_requests" DROP CONSTRAINT "FK_8763873126fda4bdd6d3cf9cf9d"`);
        await queryRunner.query(`DROP TABLE "order_cancel_requests"`);
        await queryRunner.query(`DROP TYPE "public"."order_cancel_requests_status_enum"`);
    }

}
