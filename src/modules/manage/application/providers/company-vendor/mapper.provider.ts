import { Provider } from '@nestjs/common';
import { CompanyVendorDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/company-vendor.mapper';
import { CompanyVendorDataMapper } from '../../mappers/company-vendor.mapper';

export const CompanyVendorMapperProviders: Provider[] = [
  CompanyVendorDataAccessMapper,
  CompanyVendorDataMapper,
];
