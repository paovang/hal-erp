import { Provider } from '@nestjs/common';
import { QuotaCompanyDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/quota-company.mapper';
import { QuotaCompanyDataMapper } from '../../mappers/quota-company.mapper';

export const QuotaCompanyMapperProviders: Provider[] = [
  QuotaCompanyDataAccessMapper,
  QuotaCompanyDataMapper,
];