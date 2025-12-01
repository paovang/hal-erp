import { EntityManager } from 'typeorm';

export class GetOneReportQuery {
  constructor(
    public readonly id: number,
    public readonly manager: EntityManager,
  ) {}
}
