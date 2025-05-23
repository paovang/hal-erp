import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSchema1747984341519 implements MigrationInterface {
    name = 'UpdateSchema1747984341519'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "categories" ("id" SERIAL NOT NULL, "name" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8b0be371d28245da6e4f4b6187" ON "categories" ("name") `);
        await queryRunner.query(`CREATE TABLE "currencies" ("id" SERIAL NOT NULL, "code" character varying(255) NOT NULL, "name" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_9f8d0972aeeb5a2277e40332d29" UNIQUE ("code"), CONSTRAINT "PK_d528c54860c4182db13548e08c4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9f8d0972aeeb5a2277e40332d2" ON "currencies" ("code") `);
        await queryRunner.query(`CREATE INDEX "IDX_976da6960ec4f0c96c26e3dffa" ON "currencies" ("name") `);
        await queryRunner.query(`CREATE TABLE "positions" ("id" SERIAL NOT NULL, "name" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_17e4e62ccd5749b289ae3fae6f3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5c70dc5aa01e351730e4ffc929" ON "positions" ("name") `);
        await queryRunner.query(`CREATE TYPE "public"."permission_groups_type_enum" AS ENUM('all', 'admin', 'user')`);
        await queryRunner.query(`CREATE TABLE "permission_groups" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "display_name" character varying(255) NOT NULL, "type" "public"."permission_groups_type_enum" NOT NULL DEFAULT 'all', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_4d923def23302dc5da192374bfc" UNIQUE ("name"), CONSTRAINT "UQ_9670345ecc48edf28ab3feb9ec5" UNIQUE ("display_name"), CONSTRAINT "PK_e6d3b6dc86109f8149c4d6c5400" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4d923def23302dc5da192374bf" ON "permission_groups" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_9670345ecc48edf28ab3feb9ec" ON "permission_groups" ("display_name") `);
        await queryRunner.query(`CREATE INDEX "IDX_f0e29bbe8fb8ad843b550f7824" ON "permission_groups" ("type") `);
        await queryRunner.query(`CREATE TABLE "permissions" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "guard_name" character varying(255), "permission_group_id" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_48ce552495d14eae9b187bb6716" UNIQUE ("name"), CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_48ce552495d14eae9b187bb671" ON "permissions" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_ab9f152811335d4b31ff381c16" ON "permissions" ("guard_name") `);
        await queryRunner.query(`CREATE INDEX "IDX_8f6f729862e4d1ab66c2f39cd0" ON "permissions" ("permission_group_id") `);
        await queryRunner.query(`CREATE TABLE "roles" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "guard_name" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_648e3f5447f725579d7d4ffdfb" ON "roles" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_d40be059d2456483847d8fe938" ON "roles" ("guard_name") `);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "username" character varying(255), "email" character varying(255), "password" character varying(255), "tel" character varying(191), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_a383ac5d1cc34720ea56a937a13" UNIQUE ("tel"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "department_users" ("id" SERIAL NOT NULL, "department_id" bigint, "position_id" integer, "user_id" integer, "signature_file" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_9e73e356e01f8c809defeedd703" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_da192729d410e929026a7aef25" ON "department_users" ("department_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_3388bcb6971e0ceab801895529" ON "department_users" ("position_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_5bbad0a14d3a2a1d1d473ead71" ON "department_users" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_701fb928dcc19793c917ed9c69" ON "department_users" ("signature_file") `);
        await queryRunner.query(`CREATE TABLE "departments" ("id" BIGSERIAL NOT NULL, "code" character varying(255) NOT NULL, "name" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_91fddbe23e927e1e525c152baa3" UNIQUE ("code"), CONSTRAINT "PK_839517a681a86bb84cbcc6a1e9d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_91fddbe23e927e1e525c152baa" ON "departments" ("code") `);
        await queryRunner.query(`CREATE INDEX "IDX_8681da666ad9699d568b3e9106" ON "departments" ("name") `);
        await queryRunner.query(`CREATE TABLE "department_approvers" ("id" SERIAL NOT NULL, "department_id" bigint, "user_id" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_b5aff9d5ab1da388aeb6062b11e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "document_types" ("id" BIGSERIAL NOT NULL, "code" character varying(255) NOT NULL, "name" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_5c46cecbae576329e689110cbb5" UNIQUE ("code"), CONSTRAINT "PK_d467d7eeb7c8ce216e90e8494aa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5c46cecbae576329e689110cbb" ON "document_types" ("code") `);
        await queryRunner.query(`CREATE INDEX "IDX_803cd247b7c1c8d91b30a3eb21" ON "document_types" ("name") `);
        await queryRunner.query(`CREATE TABLE "seeder_logs" ("id" BIGSERIAL NOT NULL, "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f4c857013b491a17a489ce07c95" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_10a312edcfeaec6a6f0713e739" ON "seeder_logs" ("name") `);
        await queryRunner.query(`CREATE TABLE "units" ("id" BIGSERIAL NOT NULL, "name" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_5a8f2f064919b587d93936cb223" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_cd34e4bfea359fa09d997a0b87" ON "units" ("name") `);
        await queryRunner.query(`CREATE TABLE "role_has_permissions" ("role_id" integer NOT NULL, "permission_id" integer NOT NULL, CONSTRAINT "PK_bc4792445e658ccfc1b7723d1f5" PRIMARY KEY ("role_id", "permission_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9135e97d2d840f7dfd6e664911" ON "role_has_permissions" ("role_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_09ff9df62bd01f8cf45b1b1921" ON "role_has_permissions" ("permission_id") `);
        await queryRunner.query(`CREATE TABLE "user_has_roles" ("user_id" integer NOT NULL, "role_id" integer NOT NULL, CONSTRAINT "PK_39ff1f7a28026996cf61892cc5b" PRIMARY KEY ("user_id", "role_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d2b980baf026ff8347d88ace6e" ON "user_has_roles" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_386dc0042695c976845d36be94" ON "user_has_roles" ("role_id") `);
        await queryRunner.query(`ALTER TABLE "permissions" ADD CONSTRAINT "FK_8f6f729862e4d1ab66c2f39cd08" FOREIGN KEY ("permission_group_id") REFERENCES "permission_groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "department_users" ADD CONSTRAINT "FK_da192729d410e929026a7aef253" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "department_users" ADD CONSTRAINT "FK_3388bcb6971e0ceab801895529e" FOREIGN KEY ("position_id") REFERENCES "positions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "department_users" ADD CONSTRAINT "FK_5bbad0a14d3a2a1d1d473ead71b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "department_approvers" ADD CONSTRAINT "FK_885258095314ab9b1a3c67cfd65" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "department_approvers" ADD CONSTRAINT "FK_477cbec2c3d3fe8d597d33a90cb" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_has_permissions" ADD CONSTRAINT "FK_9135e97d2d840f7dfd6e6649116" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_has_permissions" ADD CONSTRAINT "FK_09ff9df62bd01f8cf45b1b1921a" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_has_roles" ADD CONSTRAINT "FK_d2b980baf026ff8347d88ace6ee" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_has_roles" ADD CONSTRAINT "FK_386dc0042695c976845d36be948" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_has_roles" DROP CONSTRAINT "FK_386dc0042695c976845d36be948"`);
        await queryRunner.query(`ALTER TABLE "user_has_roles" DROP CONSTRAINT "FK_d2b980baf026ff8347d88ace6ee"`);
        await queryRunner.query(`ALTER TABLE "role_has_permissions" DROP CONSTRAINT "FK_09ff9df62bd01f8cf45b1b1921a"`);
        await queryRunner.query(`ALTER TABLE "role_has_permissions" DROP CONSTRAINT "FK_9135e97d2d840f7dfd6e6649116"`);
        await queryRunner.query(`ALTER TABLE "department_approvers" DROP CONSTRAINT "FK_477cbec2c3d3fe8d597d33a90cb"`);
        await queryRunner.query(`ALTER TABLE "department_approvers" DROP CONSTRAINT "FK_885258095314ab9b1a3c67cfd65"`);
        await queryRunner.query(`ALTER TABLE "department_users" DROP CONSTRAINT "FK_5bbad0a14d3a2a1d1d473ead71b"`);
        await queryRunner.query(`ALTER TABLE "department_users" DROP CONSTRAINT "FK_3388bcb6971e0ceab801895529e"`);
        await queryRunner.query(`ALTER TABLE "department_users" DROP CONSTRAINT "FK_da192729d410e929026a7aef253"`);
        await queryRunner.query(`ALTER TABLE "permissions" DROP CONSTRAINT "FK_8f6f729862e4d1ab66c2f39cd08"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_386dc0042695c976845d36be94"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d2b980baf026ff8347d88ace6e"`);
        await queryRunner.query(`DROP TABLE "user_has_roles"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_09ff9df62bd01f8cf45b1b1921"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9135e97d2d840f7dfd6e664911"`);
        await queryRunner.query(`DROP TABLE "role_has_permissions"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cd34e4bfea359fa09d997a0b87"`);
        await queryRunner.query(`DROP TABLE "units"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_10a312edcfeaec6a6f0713e739"`);
        await queryRunner.query(`DROP TABLE "seeder_logs"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_803cd247b7c1c8d91b30a3eb21"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5c46cecbae576329e689110cbb"`);
        await queryRunner.query(`DROP TABLE "document_types"`);
        await queryRunner.query(`DROP TABLE "department_approvers"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8681da666ad9699d568b3e9106"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_91fddbe23e927e1e525c152baa"`);
        await queryRunner.query(`DROP TABLE "departments"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_701fb928dcc19793c917ed9c69"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5bbad0a14d3a2a1d1d473ead71"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3388bcb6971e0ceab801895529"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_da192729d410e929026a7aef25"`);
        await queryRunner.query(`DROP TABLE "department_users"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d40be059d2456483847d8fe938"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_648e3f5447f725579d7d4ffdfb"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8f6f729862e4d1ab66c2f39cd0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ab9f152811335d4b31ff381c16"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_48ce552495d14eae9b187bb671"`);
        await queryRunner.query(`DROP TABLE "permissions"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f0e29bbe8fb8ad843b550f7824"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9670345ecc48edf28ab3feb9ec"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4d923def23302dc5da192374bf"`);
        await queryRunner.query(`DROP TABLE "permission_groups"`);
        await queryRunner.query(`DROP TYPE "public"."permission_groups_type_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5c70dc5aa01e351730e4ffc929"`);
        await queryRunner.query(`DROP TABLE "positions"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_976da6960ec4f0c96c26e3dffa"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9f8d0972aeeb5a2277e40332d2"`);
        await queryRunner.query(`DROP TABLE "currencies"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8b0be371d28245da6e4f4b6187"`);
        await queryRunner.query(`DROP TABLE "categories"`);
    }

}
