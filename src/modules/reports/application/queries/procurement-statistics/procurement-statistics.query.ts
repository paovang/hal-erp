import { EntityManager } from 'typeorm';

export class GetProcurementStatisticsQuery {
  constructor(public readonly manager: EntityManager) {}
}
