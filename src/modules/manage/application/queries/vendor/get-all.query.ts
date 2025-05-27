import { EntityManager } from 'typeorm';
import { VendorQueryDto } from '../../dto/query/vendor-query.dto';

export class GetAllQuery {
  constructor(
    public readonly dto: VendorQueryDto,
    public readonly manager: EntityManager,
  ) {}
}
