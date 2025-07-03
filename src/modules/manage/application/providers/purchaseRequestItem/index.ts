import { Provider } from '@nestjs/common';
import { PurchaseRequestItemHandlersProviders } from './command.provider';
import { PurchaseRequestItemMapperProviders } from './mapper.provider';
import { WRITE_PURCHASE_REQUEST_ITEM_REPOSITORY } from '../../constants/inject-key.const';
import { WritePurchaseRequestItemRepository } from '@src/modules/manage/infrastructure/repositories/purchaseRequestItem/write.repository';

export const PurchaseRequestItemProvider: Provider[] = [
  ...PurchaseRequestItemHandlersProviders,
  ...PurchaseRequestItemMapperProviders,
  // {
  //   provide: PURCHASE_REQUEST_ITEM_APPLICATION_SERVICE,
  //   useClass: PurchaseRequestItemService,
  // },
  {
    provide: WRITE_PURCHASE_REQUEST_ITEM_REPOSITORY,
    useClass: WritePurchaseRequestItemRepository,
  },
  // {
  //   provide: READ_PURCHASE_REQUEST_ITEM_REPOSITORY,
  //   useClass: ReadPurchaseRequestRepository,
  // },
];
