import { EntityManager } from 'typeorm';

export class GetItemIdQuery {
  constructor(
    public readonly id: number,
    public readonly manager: EntityManager,
  ) {}
}
