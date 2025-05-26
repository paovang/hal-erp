import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateSchema1748191586936 implements MigrationInterface {
  name = 'UpdateSchema1748191586936';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "categories" ("id" SERIAL NOT NULL, "name" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8b0be371d28245da6e4f4b6187" ON "categories" ("name") `,
    );
    await queryRunner.query(
      `CREATE TABLE "currencies" ("id" SERIAL NOT NULL, "code" character varying(255) NOT NULL, "name" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_9f8d0972aeeb5a2277e40332d29" UNIQUE ("code"), CONSTRAINT "PK_d528c54860c4182db13548e08c4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9f8d0972aeeb5a2277e40332d2" ON "currencies" ("code") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_976da6960ec4f0c96c26e3dffa" ON "currencies" ("name") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_976da6960ec4f0c96c26e3dffa"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9f8d0972aeeb5a2277e40332d2"`,
    );
    await queryRunner.query(`DROP TABLE "currencies"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8b0be371d28245da6e4f4b6187"`,
    );
    await queryRunner.query(`DROP TABLE "categories"`);
  }
}
