import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { EntityManager } from 'typeorm';
import { PurchaseOrderSelectedVendorEntity } from '../../entities/purchase-order-selected-vendor.entity';
import { UpdatePurchaseOrderSelectedVendorFileDto } from '@src/modules/manage/application/dto/create/purchaseOrderSelectedVendor/update-file.dto';

export interface IPurchaseOrderSelectedVendorServiceInterface {
  updateFile(
    id: number,
    dto: UpdatePurchaseOrderSelectedVendorFileDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<PurchaseOrderSelectedVendorEntity>>;
}
