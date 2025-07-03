import { EntityManager } from 'typeorm';
import { PurchaseOrderItemEntity } from '../../entities/purchase-order-item.entity';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';

export interface IWritePurchaseOrderItemRepository {
  create(
    entity: PurchaseOrderItemEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<PurchaseOrderItemEntity>>;
}
