import { EntityManager } from 'typeorm';
import { ProductQueryDto } from '../../dto/query/product-query.dto';

export class GetAllQuery {
  constructor(
    public readonly dto: ProductQueryDto,
    public readonly manager: EntityManager,
  ) {}
}