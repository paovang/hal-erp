import { EntityManager } from 'typeorm';
import { UnitQueryDto } from '../../dto/query/unit-query.dto';

export class GetAllQuery {
  constructor(
    public readonly dto: UnitQueryDto,
    public readonly manager: EntityManager,
  ) {}
}
