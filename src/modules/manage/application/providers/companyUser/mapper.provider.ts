import { Provider } from '@nestjs/common';
import { CompanyUserDataMapper } from '../../mappers/company-user.mapper';
import { CompanyUserDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/company-user.mapper';

export const MapperProviders: Provider[] = [
  CompanyUserDataMapper,
  CompanyUserDataAccessMapper,
];
