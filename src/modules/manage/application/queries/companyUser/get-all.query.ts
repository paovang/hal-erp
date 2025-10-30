import { EntityManager } from 'typeorm';
import { CompanyUserQueryDto } from '../../dto/query/company-user-query.dto';

export class GetAllQuery {
  constructor(
    public readonly dto: CompanyUserQueryDto,
    public readonly manager: EntityManager,
  ) {}
}
