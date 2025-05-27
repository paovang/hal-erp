import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSchema1748347286486 implements MigrationInterface {
    name = 'UpdateSchema1748347286486'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sub_budget_accounts" ("id" SERIAL NOT NULL, "budget_account_id" integer, "code" character varying(255) NOT NULL, "name" character varying(255), "allocated_amount" double precision, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_1c2891fe6a40cc075b1f448e79d" UNIQUE ("code"), CONSTRAINT "PK_2bf767a37dce859fd64ad48e3ae" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5ad326d46cf05bb8df7906dfd7" ON "sub_budget_accounts" ("budget_account_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_1c2891fe6a40cc075b1f448e79" ON "sub_budget_accounts" ("code") `);
        await queryRunner.query(`CREATE INDEX "IDX_423ac089bf81f8a82e5957565a" ON "sub_budget_accounts" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_8abc1349b1103e35459872e732" ON "sub_budget_accounts" ("allocated_amount") `);
        await queryRunner.query(`CREATE TABLE "budget_accounts" ("id" SERIAL NOT NULL, "code" character varying(255) NOT NULL, "name" character varying(255), "fiscal_year" integer, "allocated_amount" double precision, "description" text, "department_id" bigint, "document_type_id" bigint, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_33f9bfe6adeb70b13fa4e186a4f" UNIQUE ("code"), CONSTRAINT "PK_34c44517adef513ba171445354a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_33f9bfe6adeb70b13fa4e186a4" ON "budget_accounts" ("code") `);
        await queryRunner.query(`CREATE INDEX "IDX_e39da78e8cc8684267e4b1c516" ON "budget_accounts" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_74a42c4dac646c126378a65703" ON "budget_accounts" ("fiscal_year") `);
        await queryRunner.query(`CREATE INDEX "IDX_770e05ca5155af534ba90c4d53" ON "budget_accounts" ("allocated_amount") `);
        await queryRunner.query(`CREATE INDEX "IDX_d4243647c29a74b1b99c7248d8" ON "budget_accounts" ("description") `);
        await queryRunner.query(`CREATE INDEX "IDX_243b7ceef0bf3c355e90f63c9c" ON "budget_accounts" ("department_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_18731c19f1f97a8d60b2b829e4" ON "budget_accounts" ("document_type_id") `);
        await queryRunner.query(`ALTER TABLE "sub_budget_accounts" ADD CONSTRAINT "FK_5ad326d46cf05bb8df7906dfd74" FOREIGN KEY ("budget_account_id") REFERENCES "budget_accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "budget_accounts" ADD CONSTRAINT "FK_243b7ceef0bf3c355e90f63c9cc" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "budget_accounts" ADD CONSTRAINT "FK_18731c19f1f97a8d60b2b829e47" FOREIGN KEY ("document_type_id") REFERENCES "document_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "budget_accounts" DROP CONSTRAINT "FK_18731c19f1f97a8d60b2b829e47"`);
        await queryRunner.query(`ALTER TABLE "budget_accounts" DROP CONSTRAINT "FK_243b7ceef0bf3c355e90f63c9cc"`);
        await queryRunner.query(`ALTER TABLE "sub_budget_accounts" DROP CONSTRAINT "FK_5ad326d46cf05bb8df7906dfd74"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_18731c19f1f97a8d60b2b829e4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_243b7ceef0bf3c355e90f63c9c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d4243647c29a74b1b99c7248d8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_770e05ca5155af534ba90c4d53"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_74a42c4dac646c126378a65703"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e39da78e8cc8684267e4b1c516"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_33f9bfe6adeb70b13fa4e186a4"`);
        await queryRunner.query(`DROP TABLE "budget_accounts"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8abc1349b1103e35459872e732"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_423ac089bf81f8a82e5957565a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1c2891fe6a40cc075b1f448e79"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5ad326d46cf05bb8df7906dfd7"`);
        await queryRunner.query(`DROP TABLE "sub_budget_accounts"`);
    }

}
