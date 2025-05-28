import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { UseBankAccountCommand } from '../use-bank-account.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { VendorBankAccountEntity } from '@src/modules/manage/domain/entities/vendor-bank-account.entity';
import { WRITE_VENDOR_BANK_ACCOUNT_REPOSITORY } from '../../../constants/inject-key.const';
import { Inject } from '@nestjs/common';
import { IWriteVendorBankAccountRepository } from '@src/modules/manage/domain/ports/output/vendor-bank-account-repository.interface';
import { VendorBankAccountDataMapper } from '../../../mappers/vendor-bank-account.mapper';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { VendorBankAccountOrmEntity } from '@src/common/infrastructure/database/typeorm/vendor_bank_account.orm';
import { VendorBankAccountId } from '@src/modules/manage/domain/value-objects/vendor-bank-account-id.vo';

@CommandHandler(UseBankAccountCommand)
export class UseBankAccountCommandHandler
  implements
    IQueryHandler<
      UseBankAccountCommand,
      ResponseResult<VendorBankAccountEntity>
    >
{
  constructor(
    @Inject(WRITE_VENDOR_BANK_ACCOUNT_REPOSITORY)
    private readonly _write: IWriteVendorBankAccountRepository,
    private readonly _dataMapper: VendorBankAccountDataMapper,
  ) {}
  async execute(
    query: UseBankAccountCommand,
  ): Promise<ResponseResult<VendorBankAccountEntity>> {
    // Map to entity
    const entity = this._dataMapper.toEntityForUseBankAccount(query.dto);
    console.log('object', entity);

    // Set and validate ID
    await entity.initializeUpdateSetId(new VendorBankAccountId(query.id));
    await entity.validateExistingIdForUpdate();

    // Final existence check for ID before update
    await findOneOrFail(query.manager, VendorBankAccountOrmEntity, {
      id: entity.getId().value,
    });

    return this._write.useBankAccount(entity, query.manager);
  }
}
