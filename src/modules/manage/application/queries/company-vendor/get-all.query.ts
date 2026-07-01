import { EntityManager } from 'typeorm';
import { CompanyVendorQueryDto } from '../../dto/query/company-vendor-query.dto';

export class GetAllQuery {
  constructor(
    public readonly dto: CompanyVendorQueryDto,
    public readonly manager: EntityManager,
  ) {}
}
