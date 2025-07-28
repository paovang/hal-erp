import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { DeleteCommand } from '../delete.command';
import { HttpStatus, Inject } from '@nestjs/common';
import {
  WRITE_BUDGET_ITEM_DETAIL_REPOSITORY,
  WRITE_BUDGET_ITEM_REPOSITORY,
} from '../../../constants/inject-key.const';
import { IWriteBudgetItemRepository } from '@src/modules/manage/domain/ports/output/budget-item-repository.interace';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { BudgetItemOrmEntity } from '@src/common/infrastructure/database/typeorm/budget-item.orm';
import { BudgetItemId } from '@src/modules/manage/domain/value-objects/budget-item-id.vo';
import { BudgetItemDetailOrmEntity } from '@src/common/infrastructure/database/typeorm/budget-item-detail.orm';
import { TRANSACTION_MANAGER_SERVICE } from '@src/common/constants/inject-key.const';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { IWriteBudgetItemDetailRepository } from '@src/modules/manage/domain/ports/output/budget-item-detail-repository.interface';
import { BudgetItemDetailId } from '@src/modules/manage/domain/value-objects/budget-item-detail-rule-id.vo';

@CommandHandler(DeleteCommand)
export class DeleteCommandHandler
  implements IQueryHandler<DeleteCommand, void>
{
  constructor(
    @Inject(WRITE_BUDGET_ITEM_REPOSITORY)
    private readonly _write: IWriteBudgetItemRepository,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
    @Inject(WRITE_BUDGET_ITEM_DETAIL_REPOSITORY)
    private readonly _writeDetail: IWriteBudgetItemDetailRepository,
  ) {}

  async execute(query: DeleteCommand): Promise<void> {
    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        await this.checkData(query);
        const details = await query.manager.find(BudgetItemDetailOrmEntity, {
          where: { budget_item_id: query.id },
        });

        for (const detail of details) {
          await this._writeDetail.delete(
            new BudgetItemDetailId(detail.id),
            manager,
          );
        }

        return await this._write.delete(new BudgetItemId(query.id), manager);
      },
    );
  }

  private async checkData(query: DeleteCommand): Promise<void> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
      );
    }

    await findOneOrFail(query.manager, BudgetItemOrmEntity, {
      id: query.id,
    });

    await findOneOrFail(query.manager, BudgetItemDetailOrmEntity, {
      budget_item_id: query.id,
    });
  }
}
