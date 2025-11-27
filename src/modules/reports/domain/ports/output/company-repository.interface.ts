import { EntityManager } from 'typeorm';

export interface IReportCompanuRepository {
  reportCompany(manager: EntityManager): Promise<any>;
}
