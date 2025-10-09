import { Provider } from '@nestjs/common';
import { ReceiptItemDataMapper } from '../../mappers/receipt-item.mapper';
import { ReceiptItemDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/receipt-item.mapper';

export const ReceiptItemMapperProviders: Provider[] = [
  ReceiptItemDataAccessMapper,
  ReceiptItemDataMapper,
];
