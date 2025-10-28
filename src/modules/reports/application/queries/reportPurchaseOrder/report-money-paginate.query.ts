import { EntityManager } from 'typeorm';
import { PurchaseOrderReportQueryDto } from '../../dto/query/purchase-order-report.query.dto';

export class GetReportMoneyByPaginationQuery {
  constructor(
    public dto: PurchaseOrderReportQueryDto,
    public manager: EntityManager,
  ) {}
}