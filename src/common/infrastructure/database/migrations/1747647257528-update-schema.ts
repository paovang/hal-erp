import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSchema1747647257528 implements MigrationInterface {
    name = 'UpdateSchema1747647257528'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "departments" ("id" BIGSERIAL NOT NULL, "code" character varying(255) NOT NULL, "name" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_91fddbe23e927e1e525c152baa3" UNIQUE ("code"), CONSTRAINT "PK_839517a681a86bb84cbcc6a1e9d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_91fddbe23e927e1e525c152baa" ON "departments" ("code") `);
        await queryRunner.query(`CREATE INDEX "IDX_8681da666ad9699d568b3e9106" ON "departments" ("name") `);
        await queryRunner.query(`CREATE TABLE "seeder_logs" ("id" BIGSERIAL NOT NULL, "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f4c857013b491a17a489ce07c95" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_10a312edcfeaec6a6f0713e739" ON "seeder_logs" ("name") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_10a312edcfeaec6a6f0713e739"`);
        await queryRunner.query(`DROP TABLE "seeder_logs"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8681da666ad9699d568b3e9106"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_91fddbe23e927e1e525c152baa"`);
        await queryRunner.query(`DROP TABLE "departments"`);
    }

}
