import { Provider } from '@nestjs/common';
import { ProductTypeDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/product-type.mapper';
import { ProductTypeDataMapper } from '../../mappers/product-type.mapper';

export const ProductTypeMapperProviders: Provider[] = [
  ProductTypeDataAccessMapper,
  ProductTypeDataMapper,
];