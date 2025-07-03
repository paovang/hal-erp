import { Provider } from '@nestjs/common';
import { PurchaseRequestDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/purchase-request.mapper';
import { PurchaseRequestDataMapper } from '../../mappers/purchase-request.mapper';

export const PurchaseRequestMapperProviders: Provider[] = [
  PurchaseRequestDataAccessMapper,
  PurchaseRequestDataMapper,
];
