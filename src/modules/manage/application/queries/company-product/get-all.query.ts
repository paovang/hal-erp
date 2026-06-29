import { EntityManager } from 'typeorm';
import { CompanyProductQueryDto } from '../../dto/query/company-product-query.dto';

export class GetAllQuery {
  constructor(
    public readonly dto: CompanyProductQueryDto,
    public readonly manager: EntityManager,
  ) {}
}
