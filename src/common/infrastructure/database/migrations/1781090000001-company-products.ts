import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * company_products: per-company selection of a central catalog product.
 * Products stay a shared catalog (no company_id on `products`); this join table
 * records which products each company has picked to use.
 *
 * Every statement is idempotent (IF NOT EXISTS / drop-then-add) so it is safe to
 * re-run against partially-created state.
 */
export class CompanyProducts1781090000001 implements MigrationInterface {
  name = 'CompanyProducts1781090000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "company_products" (
        "id" SERIAL NOT NULL,
        "company_id" integer,
        "product_id" integer,
        "status" character varying NOT NULL DEFAULT 'active',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_company_products" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(
      `ALTER TABLE "company_products" DROP CONSTRAINT IF EXISTS "FK_company_products_company"`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_products" ADD CONSTRAINT "FK_company_products_company" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_products" DROP CONSTRAINT IF EXISTS "FK_company_products_product"`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_products" ADD CONSTRAINT "FK_company_products_product" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );

    // at most one active (non-deleted) selection per (company, product)
    await queryRunner.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS "uq_company_products_company_product" ON "company_products" ("company_id", "product_id") WHERE "deleted_at" IS NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "uq_company_products_company_product"`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "company_products"`);
  }
}
