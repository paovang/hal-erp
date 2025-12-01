import { EntityManager } from 'typeorm';

export class GetReportQuery {
  constructor(public readonly manager: EntityManager) {}
}
