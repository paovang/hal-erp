import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { TRANSACTION_MANAGER_SERVICE } from 'src/common/constants/inject-key.const';
import { DepartmentSeeder } from '../department.seeder';
import { ITransactionManagerService } from '@common/infrastructure/transaction/transaction.interface';
import { PermissionSeeder } from '../permission.seeder';
import { PermissionGroupSeeder } from '../permission-group.seeder';
import { RoleSeeder } from '../role.seeder';
import { ProvinceSeeder } from '../province.seeder';
import { UserSeeder } from '../user.seeder';
import { VatSeeder } from '../vat.seeder';
import { BankSeeder } from '../bank.seeder';
import { CurrencySeeder } from '../currecy.seeder';

@Injectable()
export class SeederService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly transactionManagerService: ITransactionManagerService,
    @Inject() private _departmentSeeder: DepartmentSeeder,
    @Inject() private _permissionGroupSeeder: PermissionGroupSeeder,
    @Inject() private _permissionSeeder: PermissionSeeder,
    @Inject() private _roleSeederSeeder: RoleSeeder,
    @Inject() private _provinceSeeder: ProvinceSeeder,
    @Inject() private _userSeeder: UserSeeder,
    @Inject() private _vatSeeder: VatSeeder,
    @Inject() private _bankSeeder: BankSeeder,
    @Inject() private _currency: CurrencySeeder,
  ) {}

  async seed() {
    try {
      await this.transactionManagerService.runInTransaction(
        this.dataSource,
        async (manager) => {
          await this._departmentSeeder.seed(manager);
          await this._permissionGroupSeeder.seed(manager);
          await this._permissionSeeder.seed(manager);
          await this._roleSeederSeeder.seed(manager);
          await this._provinceSeeder.seed(manager);
          await this._userSeeder.seed(manager);
          await this._vatSeeder.seed(manager);
          await this._bankSeeder.seed(manager);
          await this._currency.seed(manager);
        },
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
