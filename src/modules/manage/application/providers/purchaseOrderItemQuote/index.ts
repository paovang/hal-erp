// import { Provider } from '@nestjs/common';
// import { PurchaseOrderItemQuoteHandlersProviders } from './command.provider';
// import { PurchaseOrderItemQuoteMapperProviders } from './mapper.provider';
// import { WRITE_PURCHASE_ORDER_ITEM_QUOTE_REPOSITORY } from '../../constants/inject-key.const';
// import { WritePurchaseOrderItemQuoteRepository } from '@src/modules/manage/infrastructure/repositories/purchaseOrderItemQuote/write.repository';

// export const PurchaseOrderItemQuoteProvider: Provider[] = [
//   ...PurchaseOrderItemQuoteHandlersProviders,
//   ...PurchaseOrderItemQuoteMapperProviders,
//   {
//     provide: WRITE_PURCHASE_ORDER_ITEM_QUOTE_REPOSITORY,
//     useClass: WritePurchaseOrderItemQuoteRepository,
//   },
// ];
