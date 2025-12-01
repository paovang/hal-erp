import { CompanyQueryDto } from '@src/modules/manage/application/dto/query/company-query.dto';
import { EntityManager } from 'typeorm';

export class GetReportCompanyQuery {
  constructor(
    public manager: EntityManager,
    // public dto: CompanyQueryDto,
  ) {
    // console.log('hello world');
  }
}
