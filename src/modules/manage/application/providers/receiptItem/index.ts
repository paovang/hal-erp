import { Provider } from '@nestjs/common';
import { ReceiptItemHandlersProviders } from './command.provider';
import { ReceiptItemMapperProviders } from './mapper.provider';
import { WRITE_RECEIPT_ITEM_REPOSITORY } from '../../constants/inject-key.const';
import { WriteReceiptItemRepository } from '@src/modules/manage/infrastructure/repositories/receiptItem/write.repository';

export const ReceiptItemProvider: Provider[] = [
  ...ReceiptItemHandlersProviders,
  ...ReceiptItemMapperProviders,
  //   {
  //     provide: RECEIPT_APPLICATION_SERVICE,
  //     useClass: ReceiptService,
  //   },
  {
    provide: WRITE_RECEIPT_ITEM_REPOSITORY,
    useClass: WriteReceiptItemRepository,
  },
];
