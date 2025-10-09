import { EntityManager } from 'typeorm';
import { PositionQueryDto } from '../../dto/query/position-query.dto';

export class GetAllQuery {
  constructor(
    public readonly dto: PositionQueryDto,
    public readonly manager: EntityManager,
  ) {}
}
