import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { DeleteCommand } from '../delete.command';
import { HttpStatus, Inject } from '@nestjs/common';
import { WRITE_VENDOR_BANK_ACCOUNT_REPOSITORY } from '../../../constants/inject-key.const';
import { IWriteVendorBankAccountRepository } from '@src/modules/manage/domain/ports/output/vendor-bank-account-repository.interface';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { VendorBankAccountOrmEntity } from '@src/common/infrastructure/database/typeorm/vendor_bank_account.orm';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { VendorBankAccountId } from '@src/modules/manage/domain/value-objects/vendor-bank-account-id.vo';

@CommandHandler(DeleteCommand)
export class DeleteCommandHandler
  implements IQueryHandler<DeleteCommand, void>
{
  constructor(
    @Inject(WRITE_VENDOR_BANK_ACCOUNT_REPOSITORY)
    private readonly _write: IWriteVendorBankAccountRepository,
  ) {}

  async execute(query: DeleteCommand): Promise<void> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
        { property: `${query.id}` },
      );
    }

    /** Check Exits Document Type Id */
    await findOneOrFail(query.manager, VendorBankAccountOrmEntity, {
      id: query.id,
    });

    return await this._write.delete(
      new VendorBankAccountId(query.id),
      query.manager,
    );
  }
}
