import { WritePurchaseOrderSelectedVendorRepository } from '@src/modules/manage/infrastructure/repositories/purchaseOrderSelectVendor/write.repository';
import {
  PURCHASE_ORDER_SELECTED_VENDOR_APPLICATION_SERVICE,
  WRITE_PURCHASE_ORDER_SELECTED_VENDOR_REPOSITORY,
} from '../../constants/inject-key.const';
import { PurchaseOrderSelectedVendorHandlersProviders } from './command.provider';
import { PurchaseOrderSelectedVendorMapperProviders } from './mapper.provider';
import { Provider } from '@nestjs/common';
import { PurchaseOrderSelectedVendorService } from '../../services/purchase-order-selected-vendor.service';

export const PurchaseOrderSelectedVendorProvider: Provider[] = [
  ...PurchaseOrderSelectedVendorHandlersProviders,
  ...PurchaseOrderSelectedVendorMapperProviders,
  {
    provide: PURCHASE_ORDER_SELECTED_VENDOR_APPLICATION_SERVICE,
    useClass: PurchaseOrderSelectedVendorService,
  },
  {
    provide: WRITE_PURCHASE_ORDER_SELECTED_VENDOR_REPOSITORY,
    useClass: WritePurchaseOrderSelectedVendorRepository,
  },
];
