import { EntityManager } from 'typeorm';

export class DeleteVatCommand {
  constructor(
    public readonly id: number,
    public readonly manager: EntityManager,
  ) {}
}
