import { Provider } from '@nestjs/common';
import { PurchaseOrderSelectedVendorDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/purchase-order-selected-vendor.mapper';
import { PurchaseOrderSelectedVendorDataMapper } from '../../mappers/purchase-order-selected-vendor.mapper';

export const PurchaseOrderSelectedVendorMapperProviders: Provider[] = [
  PurchaseOrderSelectedVendorDataAccessMapper,
  PurchaseOrderSelectedVendorDataMapper,
];
