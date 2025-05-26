import { EntityManager } from 'typeorm';
import { CurrencyQueryDto } from '../../dto/query/currency-query.dto';

export class GetAllQuery {
  constructor(
    public readonly dto: CurrencyQueryDto,
    public readonly manager: EntityManager,
  ) {}
}
