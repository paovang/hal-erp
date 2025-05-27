import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { CreateCommand } from '../create.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { VendorBankAccountEntity } from '@src/modules/manage/domain/entities/vendor-bank-account.entity';
import { WRITE_VENDOR_BANK_ACCOUNT_REPOSITORY } from '../../../constants/inject-key.const';
import { Inject } from '@nestjs/common';
import { VendorBankAccountDataMapper } from '../../../mappers/vendor-bank-account.mapper';
import { IWriteVendorBankAccountRepository } from '@src/modules/manage/domain/ports/output/vendor-bank-account-repository.interface';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { VendorOrmEntity } from '@src/common/infrastructure/database/typeorm/vendor.orm';
import { CurrencyOrmEntity } from '@src/common/infrastructure/database/typeorm/currency.orm';

@CommandHandler(CreateCommand)
export class CreateCommandHandler
  implements
    IQueryHandler<CreateCommand, ResponseResult<VendorBankAccountEntity>>
{
  constructor(
    @Inject(WRITE_VENDOR_BANK_ACCOUNT_REPOSITORY)
    private readonly _write: IWriteVendorBankAccountRepository,
    private readonly _dataMapper: VendorBankAccountDataMapper,
  ) {}

  async execute(
    query: CreateCommand,
  ): Promise<ResponseResult<VendorBankAccountEntity>> {
    await findOneOrFail(query.manager, VendorOrmEntity, {
      id: query.dto.vendor_id,
    });

    await findOneOrFail(query.manager, CurrencyOrmEntity, {
      id: query.dto.currency_id,
    });

    const entity = this._dataMapper.toEntity(query.dto);

    return await this._write.create(entity, query.manager);
  }
}
