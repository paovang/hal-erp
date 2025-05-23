import { Provider } from '@nestjs/common';
import { CategoryDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/category.mapper';
import { CategoryDataMapper } from '../../mappers/category.mapper';

export const CategoryMapperProviders: Provider[] = [
  CategoryDataAccessMapper,
  CategoryDataMapper,
];
