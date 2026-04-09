import { Provider } from '@nestjs/common';
import { DocumentCategoryDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/document-category.mapper';
import { DocumentCategoryDataMapper } from '../../mappers/document-category.mapper';

export const DocumentCategoryMapperProviders: Provider[] = [
  DocumentCategoryDataAccessMapper,
  DocumentCategoryDataMapper,
];
