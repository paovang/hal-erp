import { EntityManager } from 'typeorm';

export class GetOneExchangeRateQuery {
  constructor(
    public readonly id: number,
    public readonly manager: EntityManager,
  ) {}
}
