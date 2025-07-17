import { EntityManager } from 'typeorm';

export class GetOneVatQuery {
  constructor(
    public readonly id: number,
    public readonly manager: EntityManager,
  ) {}
}
