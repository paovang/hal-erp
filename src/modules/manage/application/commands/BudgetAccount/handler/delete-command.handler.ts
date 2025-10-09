import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { DeleteCommand } from '../delete.command';
import { HttpStatus, Inject } from '@nestjs/common';
import { WRITE_BUDGET_ACCOUNT_REPOSITORY } from '../../../constants/inject-key.const';
import { IWriteBudgetAccountRepository } from '@src/modules/manage/domain/ports/output/budget-account-repository.interface';
import { BudgetAccountId } from '@src/modules/manage/domain/value-objects/budget-account-id.vo';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { BudgetAccountOrmEntity } from '@src/common/infrastructure/database/typeorm/budget-account.orm';
import { BudgetItemOrmEntity } from '@src/common/infrastructure/database/typeorm/budget-item.orm';
import { checkRelationOrThrow } from '@src/common/utils/check-relation-or-throw.util';

@CommandHandler(DeleteCommand)
export class DeleteCommandHandler
  implements IQueryHandler<DeleteCommand, void>
{
  constructor(
    @Inject(WRITE_BUDGET_ACCOUNT_REPOSITORY)
    private readonly _write: IWriteBudgetAccountRepository,
  ) {}

  async execute(query: DeleteCommand): Promise<void> {
    await this.checkData(query);
    return await this._write.delete(
      new BudgetAccountId(query.id),
      query.manager,
    );
  }

  private async checkData(query: DeleteCommand): Promise<void> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
        { property: `${query.id}` },
      );
    }

    /** Check Exits BudgetAccountId Id */
    await findOneOrFail(query.manager, BudgetAccountOrmEntity, {
      id: query.id,
    });

    await checkRelationOrThrow(
      query.manager,
      BudgetItemOrmEntity,
      { budget_account_id: query.id },
      'errors.already_in_use',
      HttpStatus.BAD_REQUEST,
      'budget item',
    );
  }
}
