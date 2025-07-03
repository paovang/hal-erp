import { Provider } from '@nestjs/common';
import { PurchaseOrderHandlersProviders } from './command.provider';
import { PurchaseOrderMapperProviders } from './mapper.provider';
import {
  PURCHASE_ORDER_APPLICATION_SERVICE,
  READ_PURCHASE_ORDER_REPOSITORY,
  WRITE_PURCHASE_ORDER_REPOSITORY,
} from '../../constants/inject-key.const';
import { ReadPurchaseOrderRepository } from '@src/modules/manage/infrastructure/repositories/purchaseOrder/read.repository';
import { PurchaseOrderService } from '../../services/purchase-order.service';
import { WritePurchaseOrderRepository } from '@src/modules/manage/infrastructure/repositories/purchaseOrder/write.repository';
import {
  LOCALIZATION_SERVICE,
  TRANSACTION_MANAGER_SERVICE,
} from '@src/common/constants/inject-key.const';
import { LocalizationService } from '@src/common/infrastructure/localization/localization.service';
import { TransactionManagerService } from '@src/common/infrastructure/transaction/transaction.service';

export const PurchaseOrderProvider: Provider[] = [
  ...PurchaseOrderHandlersProviders,
  ...PurchaseOrderMapperProviders,
  {
    provide: LOCALIZATION_SERVICE,
    useClass: LocalizationService,
  },
  {
    provide: TRANSACTION_MANAGER_SERVICE,
    useClass: TransactionManagerService,
  },
  {
    provide: PURCHASE_ORDER_APPLICATION_SERVICE,
    useClass: PurchaseOrderService,
  },
  {
    provide: WRITE_PURCHASE_ORDER_REPOSITORY,
    useClass: WritePurchaseOrderRepository,
  },
  {
    provide: READ_PURCHASE_ORDER_REPOSITORY,
    useClass: ReadPurchaseOrderRepository,
  },
];
