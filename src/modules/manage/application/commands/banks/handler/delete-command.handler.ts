import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { DeleteBankCommand } from '../delete.command';
import { HttpStatus, Inject } from '@nestjs/common';
import { WRITE_BANK_REPOSITORY } from '../../../constants/inject-key.const';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { checkRelationOrThrow } from '@src/common/utils/check-relation-or-throw.util';
import { IWriteBankRepository } from '@src/modules/manage/domain/ports/output/bank-repository.interace';
import { BankId } from '@src/modules/manage/domain/value-objects/bank-id.vo';
import { BankOrmEntity } from '@src/common/infrastructure/database/typeorm/bank.orm';
import { VendorBankAccountOrmEntity } from '@src/common/infrastructure/database/typeorm/vendor_bank_account.orm';

@CommandHandler(DeleteBankCommand)
export class DeleteBankCommandHandler
  implements IQueryHandler<DeleteBankCommand, void>
{
  constructor(
    @Inject(WRITE_BANK_REPOSITORY)
    private readonly _write: IWriteBankRepository,
  ) {}
  async execute(query: DeleteBankCommand): Promise<void> {
    await this.checkData(query);
    return await this._write.delete(new BankId(query.id), query.manager);
  }
  private async checkData(query: DeleteBankCommand): Promise<void> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
      );
    }
    await findOneOrFail(query.manager, BankOrmEntity, {
      id: query.id,
    });
    console.log('del:', query);
    await checkRelationOrThrow(
      query.manager,
      VendorBankAccountOrmEntity,
      { bank_id: query.id },
      'errors.already_in_use',
    );
  }
}
