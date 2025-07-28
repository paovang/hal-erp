import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { PurchaseOrderQueryDto } from '@src/modules/manage/application/dto/query/purchase-order.dto';
import { EntityManager } from 'typeorm';
import { PurchaseOrderEntity } from '../../entities/purchase-order.entity';
import { PurchaseOrderId } from '../../value-objects/purchase-order-id.vo';

export interface IReadPurchaseOrderRepository {
  findAll(
    query: PurchaseOrderQueryDto,
    manager: EntityManager,
    user_id?: number,
    roles?: string[],
  ): Promise<ResponseResult<PurchaseOrderEntity>>;

  findOne(
    id: PurchaseOrderId,
    manager: EntityManager,
  ): Promise<ResponseResult<PurchaseOrderEntity>>;
}

export interface IWritePurchaseOrderRepository {
  create(
    entity: PurchaseOrderEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<PurchaseOrderEntity>>;

  // update(
  //   entity: PurchaseOrderEntity,
  //   manager: EntityManager,
  // ): Promise<ResponseResult<PurchaseOrderEntity>>;

  delete(id: PurchaseOrderId, manager: EntityManager): Promise<void>;
}
