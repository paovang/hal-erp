import { EntityManager } from 'typeorm';

export interface IReportCompanuRepository {
  reportCompany(
    manager: EntityManager,
    company_id?: number,
    roles?: string[],
    department_id?: number,
  ): Promise<any>;
}
