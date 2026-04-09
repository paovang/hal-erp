import { EntityManager } from 'typeorm';

export class GetAllQuery {
  constructor(public readonly manager: EntityManager) {}
}
