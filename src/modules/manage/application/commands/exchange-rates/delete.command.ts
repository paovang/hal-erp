import { EntityManager } from 'typeorm';

export class DeleteExchangeRateCommand {
  constructor(
    public readonly id: number,
    public readonly manager: EntityManager,
  ) {}
}
