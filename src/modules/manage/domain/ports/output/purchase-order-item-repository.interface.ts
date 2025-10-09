import { EntityManager } from 'typeorm';
import { PurchaseOrderItemEntity } from '../../entities/purchase-order-item.entity';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { PurchaseOrderItemId } from '../../value-objects/purchase-order-item-id.vo';

export interface IWritePurchaseOrderItemRepository {
  create(
    entity: PurchaseOrderItemEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<PurchaseOrderItemEntity>>;

  update(
    entity: PurchaseOrderItemEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<PurchaseOrderItemEntity>>;

  delete(id: PurchaseOrderItemId, manager: EntityManager): Promise<void>;
}
