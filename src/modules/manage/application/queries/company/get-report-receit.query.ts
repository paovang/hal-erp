import { EntityManager } from 'typeorm';
import { CompanyQueryDto } from '../../dto/query/company-query.dto';

export class GetReportReceiptQuery {
  constructor(
    public readonly query: CompanyQueryDto,
    public readonly manager: EntityManager,
  ) {}
}
