import { Provider } from '@nestjs/common';
import { ProvinceDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/province.mapper';
import { ProvinceDataMapper } from '../../mappers/province.mapper';

export const ProvinceMapperProviders: Provider[] = [
  ProvinceDataAccessMapper,
  ProvinceDataMapper,
];
