import { Provider } from '@nestjs/common';
import { CompanyDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/company.mapper';
import { CompanyDataMapper } from '@src/modules/manage/application/mappers/company.mapper';

export const CompanyMapperProviders: Provider[] = [
  CompanyDataAccessMapper,
  CompanyDataMapper,
];
