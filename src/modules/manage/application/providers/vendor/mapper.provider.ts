import { Provider } from '@nestjs/common';
import { VendorDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/vendor.mapper';
import { VendorDataMapper } from '../../mappers/vendor.mapper';

export const VendorMapperProviders: Provider[] = [
  VendorDataAccessMapper,
  VendorDataMapper,
];
