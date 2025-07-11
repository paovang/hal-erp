import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { PurchaseOrderItemQuoteEntity } from '../../entities/purchase-order-item-quote.entity';
import { EntityManager } from 'typeorm';
import { PurchaseOrderItemQuoteId } from '../../value-objects/purchase-order-item-quote-id.vo';

export interface IWritePurchaseOrderItemQuoteRepository {
  create(
    entity: PurchaseOrderItemQuoteEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<PurchaseOrderItemQuoteEntity>>;

  update(
    entity: PurchaseOrderItemQuoteEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<PurchaseOrderItemQuoteEntity>>;

  delete(id: PurchaseOrderItemQuoteId, manager: EntityManager): Promise<void>;
}
