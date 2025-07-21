import { Provider } from '@nestjs/common';
import { ReceiptDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/receipt.mapper';
import { ReceiptDataMapper } from '../../mappers/receipt.mapper';

export const ReceiptMapperProviders: Provider[] = [
  ReceiptDataAccessMapper,
  ReceiptDataMapper,
];
