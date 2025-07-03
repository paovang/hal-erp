import { Provider } from '@nestjs/common';
import { PurchaseOrderItemHandlersProviders } from './command.provider';
import { PurchaseOrderItemMapperProviders } from './mapper.provider';
import { WRITE_PURCHASE_ORDER_ITEM_REPOSITORY } from '../../constants/inject-key.const';
import { WritePurchaseOrderItemRepository } from '@src/modules/manage/infrastructure/repositories/purchaseOrderItem/write.repository';

export const PurchaseOrderItemProvider: Provider[] = [
  ...PurchaseOrderItemHandlersProviders,
  ...PurchaseOrderItemMapperProviders,
  {
    provide: WRITE_PURCHASE_ORDER_ITEM_REPOSITORY,
    useClass: WritePurchaseOrderItemRepository,
  },
];
