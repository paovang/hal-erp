import { Provider } from '@nestjs/common';
import { ReceiptHandlersProviders } from './command.provider';
import { ReceiptMapperProviders } from './mapper.provider';
import {
  READ_RECEIPT_REPOSITORY,
  RECEIPT_APPLICATION_SERVICE,
  WRITE_RECEIPT_REPOSITORY,
} from '../../constants/inject-key.const';
import { ReceiptService } from '../../services/receipt.service';
import { WriteReceiptRepository } from '@src/modules/manage/infrastructure/repositories/receipt/write.repository';
import { ReadReceiptRepository } from '@src/modules/manage/infrastructure/repositories/receipt/read.repository';

export const ReceiptProvider: Provider[] = [
  ...ReceiptHandlersProviders,
  ...ReceiptMapperProviders,
  {
    provide: RECEIPT_APPLICATION_SERVICE,
    useClass: ReceiptService,
  },
  {
    provide: WRITE_RECEIPT_REPOSITORY,
    useClass: WriteReceiptRepository,
  },
  {
    provide: READ_RECEIPT_REPOSITORY,
    useClass: ReadReceiptRepository,
  },
];
