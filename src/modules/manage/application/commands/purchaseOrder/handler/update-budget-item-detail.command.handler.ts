import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { UpdateBudgetItemDetailCommand } from '../update-budget-item-detail.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { PurchaseOrderEntity } from '@src/modules/manage/domain/entities/purchase-order.entity';
import {
  WRITE_PURCHASE_ORDER_ITEM_REPOSITORY,
  WRITE_PURCHASE_ORDER_REPOSITORY,
} from '../../../constants/inject-key.const';
import { IWritePurchaseOrderRepository } from '@src/modules/manage/domain/ports/output/purchase-order-repository.interface';
import { PurchaseOrderDataMapper } from '../../../mappers/purchase-order.mapper';
import { TRANSACTION_MANAGER_SERVICE } from '@src/common/constants/inject-key.const';
import { Inject } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { DataSource } from 'typeorm';
import { UserContextService } from '@src/common/infrastructure/cls/cls.service';
import { IWritePurchaseOrderItemRepository } from '@src/modules/manage/domain/ports/output/purchase-order-item-repository.interface';
import { PurchaseOrderItemDataMapper } from '../../../mappers/purchase-order-item.mapper';
import { PurchaseOrderItemId } from '@src/modules/manage/domain/value-objects/purchase-order-item-id.vo';
import { PurchaseOrderId } from '@src/modules/manage/domain/value-objects/purchase-order-id.vo';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { PurchaseOrderOrmEntity } from '@src/common/infrastructure/database/typeorm/purchase-order.orm';
import { PurchaseOrderItemOrmEntity } from '@src/common/infrastructure/database/typeorm/purchase-order-item.orm';
import { BudgetItemDetailOrmEntity } from '@src/common/infrastructure/database/typeorm/budget-item-detail.orm';
import { UpdatePurchaseOrderBudgetItemDto } from '../../../dto/create/purchaseOrderItem/update.dto';

@CommandHandler(UpdateBudgetItemDetailCommand)
export class UpdateBudgetItemDetailCommandHandler
  implements
    IQueryHandler<
      UpdateBudgetItemDetailCommand,
      ResponseResult<PurchaseOrderEntity>
    >
{
  constructor(
    @Inject(WRITE_PURCHASE_ORDER_REPOSITORY)
    private readonly _write: IWritePurchaseOrderRepository,
    private readonly _dataMapper: PurchaseOrderDataMapper,

    // item
    @Inject(WRITE_PURCHASE_ORDER_ITEM_REPOSITORY)
    private readonly _writeItem: IWritePurchaseOrderItemRepository,
    private readonly _dataItemMapper: PurchaseOrderItemDataMapper,

    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
    private readonly _userContextService: UserContextService,
  ) {}

  async execute(
    query: UpdateBudgetItemDetailCommand,
  ): Promise<ResponseResult<PurchaseOrderEntity>> {
    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        await this.updateItem(query, manager);

        const purchaseOrderEntity = this._dataMapper.toEntity(query.dto);
        await purchaseOrderEntity.initializeUpdateSetId(
          new PurchaseOrderId(query.id),
        );
        await purchaseOrderEntity.validateExistingIdForUpdate();
        return purchaseOrderEntity;
      },
    );
  }

  private async updateItem(
    query: UpdateBudgetItemDetailCommand,
    manager: DataSource['manager'],
  ): Promise<void> {
    await findOneOrFail(manager, PurchaseOrderOrmEntity, {
      id: query.id,
    });

    await findOneOrFail(manager, PurchaseOrderItemOrmEntity, {
      id: query.dto.purchase_order_items.id,
    });

    await findOneOrFail(manager, BudgetItemDetailOrmEntity, {
      id: query.dto.purchase_order_items.budget_item_detail_id,
    });

    const itemDto = new UpdatePurchaseOrderBudgetItemDto();
    itemDto.id = query.dto.purchase_order_items.id;
    itemDto.budget_item_detail_id =
      query.dto.purchase_order_items.budget_item_detail_id;

    const entity = this._dataItemMapper.toEntityForUpdate(itemDto);
    // Save or process entity as needed
    await entity.initializeUpdateSetId(
      new PurchaseOrderItemId(query.dto.purchase_order_items.id),
    );
    await entity.validateExistingIdForUpdate();
    await this._writeItem.update(entity, manager);
  }
}
