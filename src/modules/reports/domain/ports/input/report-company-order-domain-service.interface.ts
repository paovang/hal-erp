import { EntityManager } from 'typeorm';

export interface IReportCompanyServiceInterface {
  reportCompany(manager?: EntityManager): Promise<any>;
}
