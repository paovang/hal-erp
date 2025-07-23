import { EntityManager } from 'typeorm';
import { ExchangeRateQueryDto } from '../../dto/query/exchange-rate-query.dto';

export class GetAllExchangeRateQuery {
  constructor(
    public readonly dto: ExchangeRateQueryDto,
    public readonly manager: EntityManager,
  ) {}
}
