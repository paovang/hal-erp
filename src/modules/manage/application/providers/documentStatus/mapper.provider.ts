import { Provider } from '@nestjs/common';
import { DocumentStatusDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/document-status.mapper';
import { DocumentStatusDataMapper } from '../../mappers/document-status.mapper';

export const DocumentStatusMapperProviders: Provider[] = [
  DocumentStatusDataAccessMapper,
  DocumentStatusDataMapper,
];
