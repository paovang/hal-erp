import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetReportCompanyQuery } from '../report-company.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { Inject } from '@nestjs/common';
import { REPORT_COMPANY_REPOSITORY } from '../../../constants/inject-key.const';
import { IReportCompanuRepository } from '@src/modules/reports/domain/ports/output/company-repository.interface';
import { CompanyQueryDto } from '@src/modules/manage/application/dto/query/company-query.dto';

@QueryHandler(GetReportCompanyQuery)
export class GetReportCompanyQueryHandler
  implements IQueryHandler<GetReportCompanyQuery, ResponseResult<any>>
{
  constructor(
    @Inject(REPORT_COMPANY_REPOSITORY)
    private readonly _readRepo: IReportCompanuRepository,
  ) {}

  async execute(query: GetReportCompanyQuery): Promise<ResponseResult<any>> {
    return await this._readRepo.reportCompany(query.manager);
  }
}
