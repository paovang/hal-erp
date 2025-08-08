import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { CreateCommand } from '../create.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { IncreaseBudgetDetailEntity } from '@src/modules/manage/domain/entities/increase-budget-detail.entity';
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
import { IncreaseBudgetDetailDataMapper } from '../../../mappers/increase-budget-detail.mapper';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { IncreaseBudgetOrmEntity } from '@src/common/infrastructure/database/typeorm/increase-budget.orm';
import { BudgetItemOrmEntity } from '@src/common/infrastructure/database/typeorm/budget-item.orm';
import { IWriteIncreaseBudgetRepository } from '@src/modules/manage/domain/ports/output/increase-budget-repository.interface';
import { IncreaseBudgetDataMapper } from '../../../mappers/increase-budget.mapper';
import { IncreaseBudgetId } from '@src/modules/manage/domain/value-objects/increase-budget-id.vo';
import { TRANSACTION_MANAGER_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@CommandHandler(CreateCommand)
export class CreateCommandHandler
  implements
    IQueryHandler<CreateCommand, ResponseResult<IncreaseBudgetDetailEntity>>
{
  constructor(
    @Inject(WRITE_INCREASE_BUDGET_DETAIL_REPOSITORY)
    private readonly _write: IWriteIncreaseBudgetDetailRepository,
    @Inject(READ_INCREASE_BUDGET_DETAIL_REPOSITORY)
    private readonly _readBudget: IReadIncreaseBudgetDetailRepository,
    private readonly _dataMapper: IncreaseBudgetDetailDataMapper,
    @Inject(WRITE_INCREASE_BUDGET_REPOSITORY)
    private readonly _writeBudget: IWriteIncreaseBudgetRepository,
    private readonly _dataMapperBudget: IncreaseBudgetDataMapper,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
  ) {}

  async execute(
    query: CreateCommand,
  ): Promise<ResponseResult<IncreaseBudgetDetailEntity>> {
    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        await findOneOrFail(
          query.manager,
          IncreaseBudgetOrmEntity,
          {
            id: query.id,
          },
          'increase budget',
        );
        await findOneOrFail(
          manager,
          BudgetItemOrmEntity,
          {
            id: query.dto.budget_item_id,
          },
          'budget item',
        );

        const entity = this._dataMapper.toEntity(query.dto, query.id);

        const result = await this._write.create(entity, manager);

        // sum total
        const sum_total = await this._readBudget.sum_total(
          new IncreaseBudgetId(query.id),
          manager,
        );

        // mapper total
        const entity_budget =
          await this._dataMapperBudget.toEntityUpdate(sum_total);

        // Set and validate ID
        await entity_budget.initializeUpdateSetId(
          new IncreaseBudgetId(query.id),
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
