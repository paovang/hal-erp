import { EntityManager } from 'typeorm';
import { PurchaseOrderReportQueryDto } from '../../dto/query/purchase-order-report.query.dto';

export class GetReportQuery {
  constructor(
    public readonly dto: PurchaseOrderReportQueryDto,
    public readonly manager: EntityManager,
  ) {}
}
