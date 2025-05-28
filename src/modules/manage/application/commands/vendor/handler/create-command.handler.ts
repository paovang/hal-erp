import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { CreateCommand } from '../create.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { Inject } from '@nestjs/common';
import {
  WRITE_VENDOR_BANK_ACCOUNT_REPOSITORY,
  WRITE_VENDOR_REPOSITORY,
} from '../../../constants/inject-key.const';
import { VendorEntity } from '@src/modules/manage/domain/entities/vendor.entity';
import { IWriteVendorRepository } from '@src/modules/manage/domain/ports/output/vendor-repository.interface';
import { VendorDataMapper } from '../../../mappers/vendor.mapper';
import { TRANSACTION_MANAGER_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { VendorBankAccountDataMapper } from '../../../mappers/vendor-bank-account.mapper';
import { IWriteVendorBankAccountRepository } from '@src/modules/manage/domain/ports/output/vendor-bank-account-repository.interface';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { CurrencyOrmEntity } from '@src/common/infrastructure/database/typeorm/currency.orm';

@CommandHandler(CreateCommand)
export class CreateCommandHandler
  implements IQueryHandler<CreateCommand, ResponseResult<VendorEntity>>
{
  constructor(
    @Inject(WRITE_VENDOR_REPOSITORY)
    private readonly _write: IWriteVendorRepository,
    private readonly _dataMapper: VendorDataMapper,
    private readonly _dataBankAccountMapper: VendorBankAccountDataMapper,
    @Inject(WRITE_VENDOR_BANK_ACCOUNT_REPOSITORY)
    private readonly _writeBankAccount: IWriteVendorBankAccountRepository,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
  ) {}

  async execute(query: CreateCommand): Promise<ResponseResult<VendorEntity>> {
    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        const vendorEntity = this._dataMapper.toEntity(query.dto);
        const vendor = await this._write.create(vendorEntity, manager);
        const vendor_id = (vendor as any)._id._value;

        for (const item of query.dto.vendor_bank_account) {
          await findOneOrFail(query.manager, CurrencyOrmEntity, {
            id: item.currency_id,
          });

          const data = {
            ...item,
            vendor_id: vendor_id,
          };

          const BankAccountEntity = this._dataBankAccountMapper.toEntity(data);
          await this._writeBankAccount.create(BankAccountEntity, manager);
        }

        return vendor;
      },
    );
  }
}
