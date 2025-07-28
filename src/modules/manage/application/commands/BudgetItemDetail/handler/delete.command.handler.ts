import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { DeleteCommand } from '../delete.command';
import { HttpStatus, Inject } from '@nestjs/common';
import {
  WRITE_BUDGET_ITEM_DETAIL_REPOSITORY,
  WRITE_BUDGET_ITEM_REPOSITORY,
} from '../../../constants/inject-key.const';
import { IWriteBudgetItemDetailRepository } from '@src/modules/manage/domain/ports/output/budget-item-detail-repository.interface';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { TRANSACTION_MANAGER_SERVICE } from '@src/common/constants/inject-key.const';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { BudgetItemDetailOrmEntity } from '@src/common/infrastructure/database/typeorm/budget-item-detail.orm';
import { BudgetItemDetailId } from '@src/modules/manage/domain/value-objects/budget-item-detail-rule-id.vo';
import { IWriteBudgetItemRepository } from '@src/modules/manage/domain/ports/output/budget-item-repository.interace';
import { BudgetItemDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/budget-item.mapper';
import { BudgetItemOrmEntity } from '@src/common/infrastructure/database/typeorm/budget-item.orm';
import { checkRelationOrThrow } from '@src/common/utils/check-relation-or-throw.util';
import { PurchaseOrderItemOrmEntity } from '@src/common/infrastructure/database/typeorm/purchase-order-item.orm';

@CommandHandler(DeleteCommand)
export class DeleteCommandHandler
  implements IQueryHandler<DeleteCommand, void>
{
  constructor(
    @Inject(WRITE_BUDGET_ITEM_DETAIL_REPOSITORY)
    private readonly _write: IWriteBudgetItemDetailRepository,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
    @Inject(WRITE_BUDGET_ITEM_REPOSITORY)
    private readonly _writeItem: IWriteBudgetItemRepository,
    private readonly _budgetItemMapper: BudgetItemDataAccessMapper,
  ) {}

  async execute(query: DeleteCommand): Promise<void> {
    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        if (isNaN(query.id)) {
          throw new ManageDomainException(
            'errors.must_be_number',
            HttpStatus.BAD_REQUEST,
          );
        }

        await this.checkDataBeforeDelete(query);

        const data = await findOneOrFail(manager, BudgetItemDetailOrmEntity, {
          id: query.id,
        });

        const itemId = (data as any).budget_item_id;
        const amount = (data as any).allocated_amount;

        const item = await findOneOrFail(manager, BudgetItemOrmEntity, {
          id: itemId,
        });

        const sumAmount = (item as any).allocated_amount - amount;

        const itemEntity = this._budgetItemMapper.toEntity(item);
        itemEntity.setAllocatedAmount(sumAmount);
        await this._writeItem.updateColumns(itemEntity, manager);

        return await this._write.delete(
          new BudgetItemDetailId(query.id),
          manager,
        );
      },
    );
  }

  private async checkDataBeforeDelete(query: DeleteCommand): Promise<void> {
    await checkRelationOrThrow(
      query.manager,
      PurchaseOrderItemOrmEntity,
      { budget_item_detail_id: query.id },
      'errors.already_in_use',
    );
  }
}
