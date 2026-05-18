import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddUserNameFields1747584000000 implements MigrationInterface {
  name = 'AddUserNameFields1747584000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('users', [
      new TableColumn({
        name: 'first_name',
        type: 'varchar',
        length: '255',
        isNullable: true,
      }),
      new TableColumn({
        name: 'last_name',
        type: 'varchar',
        length: '255',
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('users', ['last_name', 'first_name']);
  }
}
