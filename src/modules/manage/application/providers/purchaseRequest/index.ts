import { Provider } from '@nestjs/common';
import { PurchaseRequestMapperProviders } from './mapper.provider';
import { PurchaseRequestHandlersProviders } from './command.provider';
import {
  PURCHASE_REQUEST_APPLICATION_SERVICE,
  READ_PURCHASE_REQUEST_REPOSITORY,
  WRITE_PURCHASE_REQUEST_REPOSITORY,
} from '../../constants/inject-key.const';
import { ReadPurchaseRequestRepository } from '@src/modules/manage/infrastructure/repositories/purchaseRequest/read.repository';
import { PurchaseRequestService } from '../../services/purchase-request.service';
import { WritePurchaseRequestRepository } from '@src/modules/manage/infrastructure/repositories/purchaseRequest/write.repository';
import {
  LOCALIZATION_SERVICE,
  TRANSACTION_MANAGER_SERVICE,
} from '@src/common/constants/inject-key.const';
import { LocalizationService } from '@src/common/infrastructure/localization/localization.service';
import { TransactionManagerService } from '@src/common/infrastructure/transaction/transaction.service';

export const PurchaseRequestProvider: Provider[] = [
  ...PurchaseRequestHandlersProviders,
  ...PurchaseRequestMapperProviders,
  {
    provide: LOCALIZATION_SERVICE,
    useClass: LocalizationService,
  },
  {
    provide: TRANSACTION_MANAGER_SERVICE,
    useClass: TransactionManagerService,
  },
  {
    provide: PURCHASE_REQUEST_APPLICATION_SERVICE,
    useClass: PurchaseRequestService,
  },
  {
    provide: WRITE_PURCHASE_REQUEST_REPOSITORY,
    useClass: WritePurchaseRequestRepository,
  },
  {
    provide: READ_PURCHASE_REQUEST_REPOSITORY,
    useClass: ReadPurchaseRequestRepository,
  },
];
