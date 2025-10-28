import { EntityManager } from 'typeorm';

export interface IReportReceiptServiceInterface {
  reportMoney(manager?: EntityManager): Promise<any>;
}
