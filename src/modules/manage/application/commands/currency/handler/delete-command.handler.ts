import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { DeleteCommand } from '../delete.command';
import { HttpStatus, Inject } from '@nestjs/common';
import { WRITE_CURRENCY_REPOSITORY } from '../../../constants/inject-key.const';
import { IWriteCurrencyRepository } from '@src/modules/manage/domain/ports/output/currency-repository.interface';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { CurrencyOrmEntity } from '@src/common/infrastructure/database/typeorm/currency.orm';
import { CurrencyId } from '@src/modules/manage/domain/value-objects/currency-id.vo';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { checkRelationOrThrow } from '@src/common/utils/check-relation-or-throw.util';
import { VendorBankAccountOrmEntity } from '@src/common/infrastructure/database/typeorm/vendor_bank_account.orm';

@CommandHandler(DeleteCommand)
export class DeleteCommandHandler
  implements IQueryHandler<DeleteCommand, void>
{
  constructor(
    @Inject(WRITE_CURRENCY_REPOSITORY)
    private readonly _write: IWriteCurrencyRepository,
  ) {}
  async execute(query: DeleteCommand): Promise<void> {
    await this.checkData(query);
    return await this._write.delete(new CurrencyId(query.id), query.manager);
  }

  private async checkData(query: DeleteCommand): Promise<void> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
        { property: `${query.id}` },
      );
    }

    await findOneOrFail(query.manager, CurrencyOrmEntity, {
      id: query.id,
    });

    await checkRelationOrThrow(
      query.manager,
      VendorBankAccountOrmEntity,
      { currency_id: query.id },
      'errors.already_in_use',
      HttpStatus.BAD_REQUEST,
      'vendor bank account',
    );
  }
}
