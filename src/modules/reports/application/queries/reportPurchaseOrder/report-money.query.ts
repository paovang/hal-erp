import { EntityManager } from 'typeorm';

export class GetReportMoneyQuery {
  constructor(public readonly manager: EntityManager) {}
}
