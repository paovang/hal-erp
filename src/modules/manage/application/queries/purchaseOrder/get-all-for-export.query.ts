import { EntityManager } from 'typeorm';
import { PurchaseOrderExportQueryDto } from '../../dto/query/purchase-order-export.dto';

export class GetAllForExportQuery {
  constructor(
    public readonly dto: PurchaseOrderExportQueryDto,
    public readonly manager: EntityManager,
  ) {}
}
