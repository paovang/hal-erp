import { EntityManager } from 'typeorm';
import { PurchaseOrderSelectedVendorEntity } from '../../entities/purchase-order-selected-vendor.entity';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';

export interface IWritePurchaseOrderSelectedVendorRepository {
  create(
    entity: PurchaseOrderSelectedVendorEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<PurchaseOrderSelectedVendorEntity>>;

  // update(
  //   entity: PurchaseRequestItemEntity,
  //   manager: EntityManager,
  // ): Promise<ResponseResult<PurchaseRequestItemEntity>>;

  // delete(id: PurchaseRequestItemId, manager: EntityManager): Promise<void>;
}
