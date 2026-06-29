import { Provider } from '@nestjs/common';
import { CompanyProductDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/company-product.mapper';
import { CompanyProductDataMapper } from '../../mappers/company-product.mapper';

export const CompanyProductMapperProviders: Provider[] = [
  CompanyProductDataAccessMapper,
  CompanyProductDataMapper,
];
