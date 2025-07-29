import { Provider } from '@nestjs/common';
import { DocumentTransactionDataMapper } from '../../mappers/document-transaction.mapper';
import { DocumentTransactionDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/document-transaction.mapper';

export const DocumentTransactionMapperProviders: Provider[] = [
  DocumentTransactionDataAccessMapper,
  DocumentTransactionDataMapper,
];
