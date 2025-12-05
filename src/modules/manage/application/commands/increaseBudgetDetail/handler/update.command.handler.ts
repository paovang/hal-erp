import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { UpdateCommand } from '../update.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { IncreaseBudgetDetailEntity } from '@src/modules/manage/domain/entities/increase-budget-detail.entity';
import { Inject } from '@nestjs/common';
import {
  READ_INCREASE_BUDGET_DETAIL_REPOSITORY,
  WRITE_INCREASE_BUDGET_DETAIL_REPOSITORY,
  WRITE_INCREASE_BUDGET_REPOSITORY,
} from '../../../constants/inject-key.const';
import {
  IReadIncreaseBudgetDetailRepository,
  IWriteIncreaseBudgetDetailRepository,
} from '@src/modules/manage/domain/ports/output/increase-budget-detail-repository.interface';
import { TRANSACTION_MANAGER_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { IncreaseBudgetDataMapper } from '../../../mappers/increase-budget.mapper';
import { IWriteIncreaseBudgetRepository } from '@src/modules/manage/domain/ports/output/increase-budget-repository.interface';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { IncreaseBudgetDetailOrmEntity } from '@src/common/infrastructure/database/typeorm/increase-budget-detail.orm';
import { BudgetItemOrmEntity } from '@src/common/infrastructure/database/typeorm/budget-item.orm';
import { IncreaseBudgetDetailDataMapper } from '../../../mappers/increase-budget-detail.mapper';
// import { IncreaseBudgetId } from '@src/modules/manage/domain/value-objects/increase-budget-id.vo';
// import { IncreaseBudgetOrmEntity } from '@src/common/infrastructure/database/typeorm/increase-budget.orm';
import { IncreaseBudgetDetailId } from '@src/modules/manage/domain/value-objects/increase-budget-detail-id.vo';
import { IncreaseBudgetId } from '@src/modules/manage/domain/value-objects/increase-budget-id.vo';
import { IncreaseBudgetOrmEntity } from '@src/common/infrastructure/database/typeorm/increase-budget.orm';

@CommandHandler(UpdateCommand)
export class UpdateCommandHandler
  implements
    IQueryHandler<UpdateCommand, ResponseResult<IncreaseBudgetDetailEntity>>
{
  constructor(
    @Inject(WRITE_INCREASE_BUDGET_DETAIL_REPOSITORY)
    private readonly _write: IWriteIncreaseBudgetDetailRepository,
    private readonly _dataMapper: IncreaseBudgetDetailDataMapper,
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

  async execute(
    query: UpdateCommand,
  ): Promise<ResponseResult<IncreaseBudgetDetailEntity>> {
    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        await findOneOrFail(
          query.manager,
          IncreaseBudgetDetailOrmEntity,
          {
            id: query.id,
          },
          'increase budget detail',
        );

        // const budget_id = (detail as any).increase_budget_id;

        await findOneOrFail(
          manager,
          BudgetItemOrmEntity,
          {
            id: query.dto.budget_item_id,
          },
          'budget item',
        );

        const entity = this._dataMapper.toEntity(query.dto);
        // Set and validate ID
        await entity.initializeUpdateSetId(
          new IncreaseBudgetDetailId(query.id),
        );
        await entity.validateExistingIdForUpdate();

        // Final existence check for ID before update
        await findOneOrFail(manager, IncreaseBudgetDetailOrmEntity, {
          id: entity.getId().value,
        });

        const result = await this._write.update(entity, manager);

        const budget_id = (result as any).increase_budget_id;

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
