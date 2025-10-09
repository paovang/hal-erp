import { Provider } from '@nestjs/common';
import { PurchaseOrderItemDataMapper } from '../../mappers/purchase-order-item.mapper';
import { PurchaseOrderItemDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/purchase-order-item.mapper';

export const PurchaseOrderItemMapperProviders: Provider[] = [
  PurchaseOrderItemDataAccessMapper,
  PurchaseOrderItemDataMapper,
];
