import { EntityManager } from 'typeorm';

export class GetReportQuery {
  constructor(
    public readonly dto: any,
    public readonly manager: EntityManager,
  ) {}
}
