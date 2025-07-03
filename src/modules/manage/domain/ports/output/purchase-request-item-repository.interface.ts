import { EntityManager } from 'typeorm';
import { PurchaseRequestItemEntity } from '../../entities/purchase-request-item.entity';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { PurchaseRequestItemId } from '../../value-objects/purchase-request-item-id.vo';

export interface IWritePurchaseRequestItemRepository {
  create(
    entity: PurchaseRequestItemEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<PurchaseRequestItemEntity>>;

  update(
    entity: PurchaseRequestItemEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<PurchaseRequestItemEntity>>;

  delete(id: PurchaseRequestItemId, manager: EntityManager): Promise<void>;
}
