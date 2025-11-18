import { EntityManager } from 'typeorm';
import { QuotaCompanyQueryDto } from '../../dto/query/quota-company.dto';

export class GetAllQuery {
  constructor(
    public readonly dto: QuotaCompanyQueryDto,
    public readonly manager: EntityManager,
  ) {}
}