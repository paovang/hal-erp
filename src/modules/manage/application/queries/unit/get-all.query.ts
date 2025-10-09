import { EntityManager } from 'typeorm';
import { VatQueryDto } from '../../dto/query/vat-query.dto';

export class GetAllQuery {
  constructor(
    public readonly dto: VatQueryDto,
    public readonly manager: EntityManager,
  ) {}
}
