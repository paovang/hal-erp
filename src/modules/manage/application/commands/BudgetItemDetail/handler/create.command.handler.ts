import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { CreateCommand } from '../create.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { BudgetItemDetailEntity } from '@src/modules/manage/domain/entities/budget-item-detail.entity';
import { HttpStatus, Inject } from '@nestjs/common';
import {
  WRITE_BUDGET_ITEM_DETAIL_REPOSITORY,
  WRITE_BUDGET_ITEM_REPOSITORY,
} from '../../../constants/inject-key.const';
import { IWriteBudgetItemDetailRepository } from '@src/modules/manage/domain/ports/output/budget-item-detail-repository.interface';
import { BudgetItemDetailDataMapper } from '../../../mappers/budget-item-detail.mapper';
import { TRANSACTION_MANAGER_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { BudgetItemOrmEntity } from '@src/common/infrastructure/database/typeorm/budget-item.orm';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { BudgetAccountOrmEntity } from '@src/common/infrastructure/database/typeorm/budget-account.orm';
import { ProvinceOrmEntity } from '@src/common/infrastructure/database/typeorm/province.orm';
import { IWriteBudgetItemRepository } from '@src/modules/manage/domain/ports/output/budget-item-repository.interace';
import { BudgetItemDetailOrmEntity } from '@src/common/infrastructure/database/typeorm/budget-item-detail.orm';
import { BudgetItemDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/budget-item.mapper';

@CommandHandler(CreateCommand)
export class CreateCommandHandler
  implements
    IQueryHandler<CreateCommand, ResponseResult<BudgetItemDetailEntity>>
{
  constructor(
    @Inject(WRITE_BUDGET_ITEM_DETAIL_REPOSITORY)
    private readonly _write: IWriteBudgetItemDetailRepository,
    private readonly _dataMapper: BudgetItemDetailDataMapper,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
    @Inject(WRITE_BUDGET_ITEM_REPOSITORY)
    private readonly _writeItem: IWriteBudgetItemRepository,
    private readonly _budgetItemMapper: BudgetItemDataAccessMapper,
  ) {}

  async execute(query: CreateCommand): Promise<any> {
    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        if (isNaN(query.id)) {
          throw new ManageDomainException(
            'errors.must_be_number',
            HttpStatus.BAD_REQUEST,
            { property: `${query.id}` },
          );
        }

        const item = await findOneOrFail(manager, BudgetItemOrmEntity, {
          id: query.id,
        });

        const accountId = (item as any).budget_account_id ?? 0;

        const budgetAccount = await findOneOrFail(
          manager,
          BudgetAccountOrmEntity,
          {
            id: accountId,
          },
        );

        const item_amount = (budgetAccount as any).allocated_amount ?? 0;

        const sumAllocatedAmount = await this.getSumAllocatedAmount(
          manager,
          accountId,
        );

        const sumTotal = sumAllocatedAmount + query.dto.allocated_amount;

        if (sumTotal > item_amount) {
          throw new ManageDomainException(
            'errors.allocated_amount_exceeds_budget_account',
            HttpStatus.BAD_REQUEST,
          );
        }

        await findOneOrFail(manager, ProvinceOrmEntity, {
          id: query.dto.provinceId,
        });

        const mapToEntity = this._dataMapper.toEntity(query.dto, query.id);

        const result = await this._write.create(mapToEntity, manager);

        const itemId = (result as any)._budgetItemId ?? 0;
        const sumAmount = await this.getSumAllocatedAmountDetail(
          manager,
          itemId,
        );

        const itemEntity = this._budgetItemMapper.toEntity(item);
        itemEntity.setAllocatedAmount(sumAmount);
        await this._writeItem.updateColumns(itemEntity, manager);

        return result;
      },
    );
  }

  private async getSumAllocatedAmount(
    manager: EntityManager,
    budgetAccountId: number,
  ): Promise<number> {
    const { sumAllocatedAmount } = await manager
      .createQueryBuilder(BudgetItemOrmEntity, 'budget_items')
      .select('SUM(budget_items.allocated_amount)', 'sumAllocatedAmount')
      .where('budget_items.budget_account_id = :budgetAccountId', {
        budgetAccountId,
      })
      .getRawOne();

    return Number(sumAllocatedAmount ?? 0);
  }

  private async getSumAllocatedAmountDetail(
    manager: EntityManager,
    itemId: number,
  ): Promise<number> {
    const { sumAllocatedAmount } = await manager
      .createQueryBuilder(BudgetItemDetailOrmEntity, 'budget_item_details')
      .select('SUM(budget_item_details.allocated_amount)', 'sumAllocatedAmount')
      .where('budget_item_details.budget_item_id = :itemId', {
        itemId,
      })
      .getRawOne();

    return Number(sumAllocatedAmount ?? 0);
  }
}
