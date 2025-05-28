import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateSchema1748416567819 implements MigrationInterface {
  name = 'UpdateSchema1748416567819';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "budget_approval_rules" ("id" SERIAL NOT NULL, "department_id" bigint, "approver_id" integer, "min_amount" double precision, "max_amount" double precision, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_4892be6b3cf5860ab1da2bde6f1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_352ff3cc7da4c58dd0d4e7f51d" ON "budget_approval_rules" ("department_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fc0d663d0646938057ba235e7c" ON "budget_approval_rules" ("approver_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d01591ee27a474ea3de84fd734" ON "budget_approval_rules" ("min_amount") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4f867671781e4c4c997721bd24" ON "budget_approval_rules" ("max_amount") `,
    );
    await queryRunner.query(
      `CREATE TABLE "vendors" ("id" BIGSERIAL NOT NULL, "name" character varying(255), "contact_info" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_9c956c9797edfae5c6ddacc4e6e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_83065ec2a2c5052786c122e95b" ON "vendors" ("name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a6d0d6d1231d28af3ce366a35c" ON "vendors" ("contact_info") `,
    );
    await queryRunner.query(
      `CREATE TABLE "vendor_bank_accounts" ("id" BIGSERIAL NOT NULL, "vendor_id" bigint, "currency_id" integer, "bank_name" character varying(255), "account_name" character varying(255), "account_number" character varying(255), "is_selected" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_737114e245e303e951b7cc3f0c9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_94e674d49212d992777ba20b8f" ON "vendor_bank_accounts" ("vendor_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4c4586a1097b110383d2d66f9b" ON "vendor_bank_accounts" ("currency_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_29f8d70c24dbe1116c9b2be8de" ON "vendor_bank_accounts" ("bank_name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1e82bcf21b052d5e2e9f6f9c50" ON "vendor_bank_accounts" ("account_name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b99cc1ebfc148d34854c867d7b" ON "vendor_bank_accounts" ("account_number") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ffcce5c6aaf5d7f08c75db575c" ON "vendor_bank_accounts" ("is_selected") `,
    );
    await queryRunner.query(
      `ALTER TABLE "budget_approval_rules" ADD CONSTRAINT "FK_352ff3cc7da4c58dd0d4e7f51dc" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget_approval_rules" ADD CONSTRAINT "FK_fc0d663d0646938057ba235e7cc" FOREIGN KEY ("approver_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "vendor_bank_accounts" ADD CONSTRAINT "FK_94e674d49212d992777ba20b8fb" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "vendor_bank_accounts" ADD CONSTRAINT "FK_4c4586a1097b110383d2d66f9bc" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "vendor_bank_accounts" DROP CONSTRAINT "FK_4c4586a1097b110383d2d66f9bc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vendor_bank_accounts" DROP CONSTRAINT "FK_94e674d49212d992777ba20b8fb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget_approval_rules" DROP CONSTRAINT "FK_fc0d663d0646938057ba235e7cc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget_approval_rules" DROP CONSTRAINT "FK_352ff3cc7da4c58dd0d4e7f51dc"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ffcce5c6aaf5d7f08c75db575c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b99cc1ebfc148d34854c867d7b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1e82bcf21b052d5e2e9f6f9c50"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_29f8d70c24dbe1116c9b2be8de"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4c4586a1097b110383d2d66f9b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_94e674d49212d992777ba20b8f"`,
    );
    await queryRunner.query(`DROP TABLE "vendor_bank_accounts"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a6d0d6d1231d28af3ce366a35c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_83065ec2a2c5052786c122e95b"`,
    );
    await queryRunner.query(`DROP TABLE "vendors"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4f867671781e4c4c997721bd24"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d01591ee27a474ea3de84fd734"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fc0d663d0646938057ba235e7c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_352ff3cc7da4c58dd0d4e7f51d"`,
    );
    await queryRunner.query(`DROP TABLE "budget_approval_rules"`);
  }
}
