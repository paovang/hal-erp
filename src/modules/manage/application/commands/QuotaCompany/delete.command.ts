import { EntityManager } from 'typeorm';

export class DeleteCommand {
  constructor(
    public readonly id: number,
    public readonly manager: EntityManager,
  ) {}
}