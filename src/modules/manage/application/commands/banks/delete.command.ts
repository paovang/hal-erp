import { EntityManager } from 'typeorm';

export class DeleteBankCommand {
  constructor(
    public readonly id: number,
    public readonly manager: EntityManager,
  ) {}
}
