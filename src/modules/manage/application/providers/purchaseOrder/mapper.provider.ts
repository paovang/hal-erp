import { PurchaseOrderDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/purchase-order.mapper';
import { PurchaseOrderDataMapper } from '../../mappers/purchase-order.mapper';
import { Provider } from '@nestjs/common';

export const PurchaseOrderMapperProviders: Provider[] = [
  PurchaseOrderDataAccessMapper,
  PurchaseOrderDataMapper,
];
