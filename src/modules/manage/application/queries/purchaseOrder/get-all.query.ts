import { EntityManager } from 'typeorm';
import { PurchaseOrderQueryDto } from '../../dto/query/purchase-order.dto';

export class GetAllQuery {
  constructor(
    public readonly dto: PurchaseOrderQueryDto,
    public readonly manager: EntityManager,
  ) {}
}
