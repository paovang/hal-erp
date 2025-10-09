import { EntityManager } from 'typeorm';
import { PurchaseOrderSelectedVendorEntity } from '../../entities/purchase-order-selected-vendor.entity';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { PurchaseOrderSelectedVendorId } from '../../value-objects/purchase-order-selected-vendor-id.vo';

export interface IWritePurchaseOrderSelectedVendorRepository {
  create(
    entity: PurchaseOrderSelectedVendorEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<PurchaseOrderSelectedVendorEntity>>;

  update(
    entity: PurchaseOrderSelectedVendorEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<PurchaseOrderSelectedVendorEntity>>;

  delete(
    id: PurchaseOrderSelectedVendorId,
    manager: EntityManager,
  ): Promise<void>;
}
