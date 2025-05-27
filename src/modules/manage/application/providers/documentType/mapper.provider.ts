import { Provider } from '@nestjs/common';
import { DocumentTypeDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/document-type.mapper';
import { DocumentTypeDataMapper } from '../../mappers/document-type.mapper';

export const DocumentTypeMapperProviders: Provider[] = [
  DocumentTypeDataAccessMapper,
  DocumentTypeDataMapper,
];
