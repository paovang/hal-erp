import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { TRANSACTION_MANAGER_SERVICE } from 'src/common/constants/inject-key.const';
import { DepartmentSeeder } from '../department.seeder';
import { ITransactionManagerService } from 'src/common/application/interfaces/transaction.interface';
import { PermissionSeeder } from '../permission.seeder';
import { PermissionGroupSeeder } from '../permission-group.seeder';
import { RoleSeeder } from '../role.seeder';

@Injectable()
export class SeederService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly transactionManagerService: ITransactionManagerService,
    @Inject() private _userSeeder: DepartmentSeeder,
    @Inject() private _permissionSeeder: PermissionSeeder,
    @Inject() private _permissionGroupSeeder: PermissionGroupSeeder,
    @Inject() private _roleSeederSeeder: RoleSeeder,
  ) {}

  async seed() {
    try {
      await this.transactionManagerService.runInTransaction(
        this.dataSource,
        async (manager) => {
          await this._userSeeder.seed(manager);
          await this._permissionSeeder.seed(manager);
          await this._permissionGroupSeeder.seed(manager);
          await this._roleSeederSeeder.seed(manager);
        },
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
