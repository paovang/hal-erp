import { EntityManager } from 'typeorm';
import { PurchaseRequestReportQueryDto } from '../../dto/query/purchase-request-report.query.dto';

export class GetReportQuery {
  constructor(
    public readonly dto: PurchaseRequestReportQueryDto,
    public readonly manager: EntityManager,
  ) {}
}
