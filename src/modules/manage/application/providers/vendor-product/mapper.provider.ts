import { Provider } from '@nestjs/common';
import { VendorProductDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/vendor-product.mapper';
import { VendorProductDataMapper } from '../../mappers/vendor-product.mapper';

export const VendorProductMapperProviders: Provider[] = [
  VendorProductDataAccessMapper,
  VendorProductDataMapper,
];
