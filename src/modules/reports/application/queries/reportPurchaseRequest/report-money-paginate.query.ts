import { EntityManager } from 'typeorm';
import { PurchaseRequestReportQueryDto } from '../../dto/query/purchase-request-report.query.dto';

export class GetReportMoneyByPaginationQuery {
  constructor(
    public dto: PurchaseRequestReportQueryDto,
    public manager: EntityManager,
  ) {}
}
