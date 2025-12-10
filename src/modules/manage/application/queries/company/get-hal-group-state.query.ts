import { EntityManager } from 'typeorm';
import { reportHalGroupQueryDto } from '../../dto/query/company-query.dto';

export class GetHalStateQuery {
  constructor(
    public readonly query: reportHalGroupQueryDto,
    public readonly manager: EntityManager,
  ) {}
}
