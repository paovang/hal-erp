import { EntityManager } from 'typeorm';

export interface IReportReceiptRepository {
  reportMoney(manager: EntityManager): Promise<any>;
}
