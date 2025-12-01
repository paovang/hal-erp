// import { CompanyQueryDto } from '@src/modules/manage/application/dto/query/company-query.dto';
import { EntityManager } from 'typeorm';

export interface IReportCompanyServiceInterface {
  reportCompany(manager?: EntityManager): Promise<any>;
}
