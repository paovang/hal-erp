import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { UpdateCommand } from '../update.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { VendorBankAccountEntity } from '@src/modules/manage/domain/entities/vendor-bank-account.entity';
import { HttpStatus, Inject } from '@nestjs/common';
import { WRITE_VENDOR_BANK_ACCOUNT_REPOSITORY } from '../../../constants/inject-key.const';
import { IWriteVendorBankAccountRepository } from '@src/modules/manage/domain/ports/output/vendor-bank-account-repository.interface';
import { VendorBankAccountDataMapper } from '../../../mappers/vendor-bank-account.mapper';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { VendorBankAccountId } from '@src/modules/manage/domain/value-objects/vendor-bank-account-id.vo';
import { VendorBankAccountOrmEntity } from '@src/common/infrastructure/database/typeorm/vendor_bank_account.orm';
import { VendorOrmEntity } from '@src/common/infrastructure/database/typeorm/vendor.orm';
import { CurrencyOrmEntity } from '@src/common/infrastructure/database/typeorm/currency.orm';

@CommandHandler(UpdateCommand)
export class UpdateCommandHandler
  implements
    IQueryHandler<UpdateCommand, ResponseResult<VendorBankAccountEntity>>
{
  constructor(
    @Inject(WRITE_VENDOR_BANK_ACCOUNT_REPOSITORY)
    private readonly _write: IWriteVendorBankAccountRepository,
    private readonly _dataMapper: VendorBankAccountDataMapper,
  ) {}
  async execute(
    query: UpdateCommand,
  ): Promise<ResponseResult<VendorBankAccountEntity>> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
      );
    }

    await findOneOrFail(query.manager, VendorOrmEntity, {
      id: query.dto.vendor_id,
    });

    await findOneOrFail(query.manager, CurrencyOrmEntity, {
      id: query.dto.currency_id,
    });

    // Map to entity
    const entity = this._dataMapper.toEntity(query.dto);

    // Set and validate ID
    await entity.initializeUpdateSetId(new VendorBankAccountId(query.id));
    await entity.validateExistingIdForUpdate();

    // Final existence check for ID before update
    await findOneOrFail(query.manager, VendorBankAccountOrmEntity, {
      id: entity.getId().value,
    });

    return this._write.update(entity, query.manager);
  }
}
