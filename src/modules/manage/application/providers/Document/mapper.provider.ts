import { Provider } from '@nestjs/common';
import { DocumentDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/document.mapper';
import { DocumentDataMapper } from '../../mappers/document.mapper';

export const DocumentMapperProviders: Provider[] = [
  DocumentDataAccessMapper,
  DocumentDataMapper,
];
