import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { CreateCommand } from '../create.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { BudgetItemEntity } from '@src/modules/manage/domain/entities/budget-item.entity';
import { Inject } from '@nestjs/common';
import {
  WRITE_BUDGET_ITEM_DETAIL_REPOSITORY,
  WRITE_BUDGET_ITEM_REPOSITORY,
} from '../../../constants/inject-key.const';
import { BudgetItemDataMapper } from '../../../mappers/budget-item.mapper';
import { TRANSACTION_MANAGER_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { IWriteBudgetItemRepository } from '@src/modules/manage/domain/ports/output/budget-item-repository.interace';
import { IWriteBudgetItemDetailRepository } from '@src/modules/manage/domain/ports/output/budget-item-detail-repository.interface';
import { BudgetItemDetailDataMapper } from '../../../mappers/budget-item-detail.mapper';
import { BudgetAccountOrmEntity } from '@src/common/infrastructure/database/typeorm/budget-account.orm';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';

@CommandHandler(CreateCommand)
export class CreateCommandHandler
  implements IQueryHandler<CreateCommand, ResponseResult<BudgetItemEntity>>
{
  constructor(
    @Inject(WRITE_BUDGET_ITEM_REPOSITORY)
    private readonly _write: IWriteBudgetItemRepository,
    private readonly _dataMapper: BudgetItemDataMapper,
    @Inject(WRITE_BUDGET_ITEM_DETAIL_REPOSITORY)
    private readonly _writeDetail: IWriteBudgetItemDetailRepository,
    private readonly _dataMapperDetail: BudgetItemDetailDataMapper,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
  ) {}

  async execute(
    query: CreateCommand,
  ): Promise<ResponseResult<BudgetItemEntity>> {
    const budgetAccountId = Number(query.dto.budget_accountId);
    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        await findOneOrFail(manager, BudgetAccountOrmEntity, {
          id: budgetAccountId,
        });

        // const sumAllocatedAmount = await this.getSumAllocatedAmount(
        //   manager,
        //   budgetAccountId,
        // );

        // const allocatedAmount = (budgetAccount as any).allocated_amount ?? 0;

        // if (sumAllocatedAmount && sumAllocatedAmount > allocatedAmount) {
        //   throw new ManageDomainException(
        //     'errors.allocated_amount_exceeds_budget_account',
        //     HttpStatus.BAD_REQUEST,
        //   );
        // }

        const mapToEntity = this._dataMapper.toEntity(query.dto);

        return await this._write.create(mapToEntity, manager);

        // let budgetItemEntity: BudgetItemEntity;
        // if (Array.isArray(createResult)) {
        //   budgetItemEntity = createResult[0];
        // } else if ('data' in createResult) {
        //   budgetItemEntity = (createResult as any).data;
        // } else {
        //   budgetItemEntity = createResult as BudgetItemEntity;
        // }

        // const budgetItemId =
        //   (budgetItemEntity as any)._id?._value ?? (budgetItemEntity as any).id;

        // const budgetItemDetails = query.dto.budget_item_details;

        // const totalAllocatedAmount = budgetItemDetails.reduce((sum, item) => {
        //   return sum + item.allocated_amount;
        // }, 0);

        // const sumTotal = sumAllocatedAmount + totalAllocatedAmount;

        // if (sumTotal > allocatedAmount) {
        //   throw new ManageDomainException(
        //     'errors.allocated_amount_exceeds_budget_account',
        //     HttpStatus.BAD_REQUEST,
        //     { amount: allocatedAmount.toString() },
        //   );
        // }

        // for (const item of query.dto.budget_item_details) {
        //   await findOneOrFail(manager, ProvinceOrmEntity, {
        //     id: item.provinceId,
        //   });

        //   const mapToDetailEntities = this._dataMapperDetail.toEntity(
        //     item,
        //     budgetItemId,
        //   );
        //   await this._writeDetail.create(mapToDetailEntities, manager);
        // }

        // (budgetItemEntity as any)._allocatedAmount = totalAllocatedAmount;
        // return await this._write.updateColumns(budgetItemEntity, manager);
      },
    );
  }

  // private async getSumAllocatedAmount(
  //   manager: EntityManager,
  //   budgetAccountId: number,
  // ): Promise<number> {
  //   const { sumAllocatedAmount } = await manager
  //     .createQueryBuilder(BudgetItemOrmEntity, 'budget_items')
  //     .select('SUM(budget_items.allocated_amount)', 'sumAllocatedAmount')
  //     .where('budget_items.budget_account_id = :budgetAccountId', {
  //       budgetAccountId,
  //     })
  //     .getRawOne();

  //   return Number(sumAllocatedAmount ?? 0);
  // }
}
