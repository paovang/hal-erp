import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMailSendWindow1779865400000 implements MigrationInterface {
  name = 'AddMailSendWindow1779865400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "user_mail_preferences" (
        "id" SERIAL NOT NULL,
        "user_id" integer NOT NULL,
        "start_time" TIME,
        "end_time" TIME,
        "is_enabled" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "UQ_user_mail_preferences_user_id" UNIQUE ("user_id"),
        CONSTRAINT "PK_user_mail_preferences" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "user_mail_preferences"
        ADD CONSTRAINT "FK_user_mail_preferences_user"
        FOREIGN KEY ("user_id") REFERENCES "users"("id")
        ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      CREATE TABLE "pending_approval_notifications" (
        "id" SERIAL NOT NULL,
        "user_id" integer NOT NULL,
        "payload" jsonb NOT NULL,
        "status" character varying(20) NOT NULL DEFAULT 'PENDING',
        "sent_at" TIMESTAMP,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_pending_approval_notifications" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_pending_approval_notifications_status"
        ON "pending_approval_notifications" ("status")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "IDX_pending_approval_notifications_status"`,
    );
    await queryRunner.query(`DROP TABLE "pending_approval_notifications"`);
    await queryRunner.query(
      `ALTER TABLE "user_mail_preferences" DROP CONSTRAINT "FK_user_mail_preferences_user"`,
    );
    await queryRunner.query(`DROP TABLE "user_mail_preferences"`);
  }
}
