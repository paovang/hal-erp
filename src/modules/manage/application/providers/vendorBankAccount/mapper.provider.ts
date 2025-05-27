import { Provider } from '@nestjs/common';
import { VendorBankAccountDataMapper } from '../../mappers/vendor-bank-account.mapper';
import { VendorBankAccountDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/vendor-bank-account.mapper';

export const VendorBankAccountMapperProviders: Provider[] = [
  VendorBankAccountDataAccessMapper,
  VendorBankAccountDataMapper,
];
