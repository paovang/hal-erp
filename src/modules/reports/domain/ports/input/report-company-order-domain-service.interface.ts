import { CompanyQueryDto } from '@src/modules/manage/application/dto/query/company-query.dto';
import { EntityManager } from 'typeorm';

export interface IReportCompanyServiceInterface {
  reportCompany(dto: CompanyQueryDto, manager?: EntityManager): Promise<any>;
}
