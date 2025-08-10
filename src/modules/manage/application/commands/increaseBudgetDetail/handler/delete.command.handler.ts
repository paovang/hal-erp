import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { DeleteCommand } from '../delete.command';
import {
  READ_INCREASE_BUDGET_DETAIL_REPOSITORY,
  WRITE_INCREASE_BUDGET_DETAIL_REPOSITORY,
  WRITE_INCREASE_BUDGET_REPOSITORY,
} from '../../../constants/inject-key.const';
import { Inject } from '@nestjs/common';
import {
  IReadIncreaseBudgetDetailRepository,
  IWriteIncreaseBudgetDetailRepository,
} from '@src/modules/manage/domain/ports/output/increase-budget-detail-repository.interface';
import { IncreaseBudgetDetailOrmEntity } from '@src/common/infrastructure/database/typeorm/increase-budget-detail.orm';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { IncreaseBudgetDetailId } from '@src/modules/manage/domain/value-objects/increase-budget-detail-id.vo';
import { IWriteIncreaseBudgetRepository } from '@src/modules/manage/domain/ports/output/increase-budget-repository.interface';
import { IncreaseBudgetDataMapper } from '../../../mappers/increase-budget.mapper';
import { IncreaseBudgetId } from '@src/modules/manage/domain/value-objects/increase-budget-id.vo';
import { TRANSACTION_MANAGER_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { IncreaseBudgetOrmEntity } from '@src/common/infrastructure/database/typeorm/increase-budget.orm';

@CommandHandler(DeleteCommand)
export class DeleteCommandHandler
  implements IQueryHandler<DeleteCommand, void>
{
  constructor(
    @Inject(WRITE_INCREASE_BUDGET_DETAIL_REPOSITORY)
    private readonly _write: IWriteIncreaseBudgetDetailRepository,
    @Inject(READ_INCREASE_BUDGET_DETAIL_REPOSITORY)
    private readonly _readBudget: IReadIncreaseBudgetDetailRepository,
    @Inject(WRITE_INCREASE_BUDGET_REPOSITORY)
    private readonly _writeBudget: IWriteIncreaseBudgetRepository,
    private readonly _dataMapperBudget: IncreaseBudgetDataMapper,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
  ) {}

  async execute(query: DeleteCommand): Promise<void> {
    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        const detail = await findOneOrFail(
          query.manager,
          IncreaseBudgetDetailOrmEntity,
          {
            id: query.id,
          },
          'increase budget detail',
        );

        const budget_id = (detail as any).increase_budget_id;

        const result = await this._write.delete(
          new IncreaseBudgetDetailId(query.id),
          query.manager,
        );

        // sum total
        const sum_total = await this._readBudget.sum_total(
          new IncreaseBudgetId(budget_id),
          manager,
        );

        // mapper total
        const entity_budget =
          await this._dataMapperBudget.toEntityUpdate(sum_total);

        // Set and validate ID
        await entity_budget.initializeUpdateSetId(
          new IncreaseBudgetId(budget_id),
        );
        await entity_budget.validateExistingIdForUpdate();

        // Final existence check for ID before update
        await findOneOrFail(manager, IncreaseBudgetOrmEntity, {
          id: entity_budget.getId().value,
        });

        await this._writeBudget.update(entity_budget, manager);

        return result;
      },
    );
  }
}
