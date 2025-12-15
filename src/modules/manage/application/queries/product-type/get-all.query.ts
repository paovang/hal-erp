import { EntityManager } from 'typeorm';
import { ProductTypeQueryDto } from '../../dto/query/product-type-query.dto';

export class GetAllQuery {
  constructor(
    public readonly dto: ProductTypeQueryDto,
    public readonly manager: EntityManager,
  ) {}
}
