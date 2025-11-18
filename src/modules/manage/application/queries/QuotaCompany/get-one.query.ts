import { EntityManager } from 'typeorm';

export class GetOneQuery {
  constructor(
    public readonly id: number,
    public readonly manager: EntityManager,
  ) {}
}