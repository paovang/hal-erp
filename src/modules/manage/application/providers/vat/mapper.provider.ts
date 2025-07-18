import { Provider } from '@nestjs/common';
import { VatDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/vat.mapper';
import { VatDataMapper } from '../../mappers/vat.mapper';

export const VatMapperProviders: Provider[] = [
  VatDataAccessMapper,
  VatDataMapper,
];
