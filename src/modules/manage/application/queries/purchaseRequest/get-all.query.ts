import { EntityManager } from 'typeorm';
import { PurchaseRequestQueryDto } from '../../dto/query/purchase-request.dto';

export class GetAllQuery {
  constructor(
    public readonly dto: PurchaseRequestQueryDto,
    public readonly manager: EntityManager,
  ) {}
}
