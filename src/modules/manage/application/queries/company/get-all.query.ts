import { CompanyQueryDto } from '@src/modules/manage/application/dto/query/company-query.dto';
import { EntityManager } from 'typeorm';

export class GetAllQuery {
  constructor(
    public readonly dto: CompanyQueryDto,
    public readonly manager: EntityManager,
  ) {}
}
