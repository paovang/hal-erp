import { WritePurchaseOrderSelectedVendorRepository } from '@src/modules/manage/infrastructure/repositories/purchaseOrderSelectVendor/write.repository';
import { WRITE_PURCHASE_ORDER_SELECTED_VENDOR_REPOSITORY } from '../../constants/inject-key.const';
import { PurchaseOrderSelectedVendorHandlersProviders } from './command.provider';
import { PurchaseOrderSelectedVendorMapperProviders } from './mapper.provider';
import { Provider } from '@nestjs/common';

export const PurchaseOrderSelectedVendorProvider: Provider[] = [
  ...PurchaseOrderSelectedVendorHandlersProviders,
  ...PurchaseOrderSelectedVendorMapperProviders,
  {
    provide: WRITE_PURCHASE_ORDER_SELECTED_VENDOR_REPOSITORY,
    useClass: WritePurchaseOrderSelectedVendorRepository,
  },
];
