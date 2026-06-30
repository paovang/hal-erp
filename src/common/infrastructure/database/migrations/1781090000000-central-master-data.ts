import { MigrationInterface, QueryRunner } from 'typeorm';

export class CentralMasterData1781090000000 implements MigrationInterface {
  name = 'CentralMasterData1781090000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1.1 company_vendors: per-company onboarding of a central vendor + credit terms
    await queryRunner.query(`
      CREATE TABLE "company_vendors" (
        "id" BIGSERIAL NOT NULL,
        "company_id" bigint,
        "vendor_id" bigint,
        "status" character varying NOT NULL DEFAULT 'active',
        "credit_term_days" integer NOT NULL DEFAULT 0,
        "credit_limit" numeric(18,2) NOT NULL DEFAULT '0.00',
        "payment_term" character varying,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_company_vendors" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(
      `ALTER TABLE "company_vendors" ADD CONSTRAINT "FK_company_vendors_company" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_vendors" ADD CONSTRAINT "FK_company_vendors_vendor" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    // 1.2 at most one active (non-deleted) onboarding per (company, vendor)
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_company_vendors_company_vendor_active" ON "company_vendors" ("company_id", "vendor_id") WHERE "deleted_at" IS NULL`,
    );

    // 1.3 account category mapping on the item master
    await queryRunner.query(
      `ALTER TABLE "products" ADD COLUMN "category_id" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "FK_products_category" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    );

    // 1.4 snapshot of the resolved account category on the PR line
    await queryRunner.query(
      `ALTER TABLE "purchase_request_items" ADD COLUMN "category_id" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchase_request_items" ADD CONSTRAINT "FK_purchase_request_items_category" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    );

    // 1.5 (Optional) Backfill: seed company_vendors from existing vendor usage so
    // currently-used vendors stay selectable per company. Derived from purchase
    // orders already linked to a company's documents.
    await queryRunner.query(`
      INSERT INTO "company_vendors" ("company_id", "vendor_id", "status")
      SELECT DISTINCT d."company_id", posv."vendor_id", 'active'
      FROM "purchase_order_selected_vendors" posv
      JOIN "purchase_order_items" poi ON poi."id" = posv."purchase_order_item_id"
      JOIN "purchase_orders" po ON po."id" = poi."purchase_order_id"
      JOIN "documents" d ON d."id" = po."document_id"
      WHERE d."company_id" IS NOT NULL
        AND posv."vendor_id" IS NOT NULL
      ON CONFLICT DO NOTHING
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "purchase_request_items" DROP CONSTRAINT "FK_purchase_request_items_category"`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchase_request_items" DROP COLUMN "category_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT "FK_products_category"`,
    );
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "category_id"`);
    await queryRunner.query(
      `DROP INDEX "UQ_company_vendors_company_vendor_active"`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_vendors" DROP CONSTRAINT "FK_company_vendors_vendor"`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_vendors" DROP CONSTRAINT "FK_company_vendors_company"`,
    );
    await queryRunner.query(`DROP TABLE "company_vendors"`);
  }
}
