import { EntityManager } from 'typeorm';
import { CategoryQueryDto } from '../../dto/query/category-query.dto';

export class GetAllQuery {
  constructor(
    public readonly dto: CategoryQueryDto,
    public readonly manager: EntityManager,
  ) {}
}
