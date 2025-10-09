import { EntityManager } from 'typeorm';

export class GetOneBankQuery {
  constructor(
    public readonly id: number,
    public readonly manager: EntityManager,
  ) {}
}
