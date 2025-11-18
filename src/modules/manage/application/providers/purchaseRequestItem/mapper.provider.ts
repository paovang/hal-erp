import { Provider } from '@nestjs/common';
import { PurchaseRequestItemDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/purchase-request-item.mapper';
import { PurchaseRequestItemDataMapper } from '../../mappers/purchase-request-item.mapper';
import { QuotaCompanyDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/quota-company.mapper';

export const PurchaseRequestItemMapperProviders: Provider[] = [
  PurchaseRequestItemDataAccessMapper,
  PurchaseRequestItemDataMapper,
  QuotaCompanyDataAccessMapper,
];
