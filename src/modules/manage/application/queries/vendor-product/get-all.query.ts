import { EntityManager } from 'typeorm';
import { VendorProductQueryDto } from '../../dto/query/vendor-product-query.dto';

export class GetAllQuery {
  constructor(
    public readonly dto: VendorProductQueryDto,
    public readonly manager: EntityManager,
  ) {}
}
