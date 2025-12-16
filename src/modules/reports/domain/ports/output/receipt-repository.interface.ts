import { EntityManager } from 'typeorm';

export interface IReportReceiptRepository {
  reportMoney(
    manager: EntityManager,
    company_id?: number,
    roles?: string,
    department_id?: number,
  ): Promise<any>;
}
