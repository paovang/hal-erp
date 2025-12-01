import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { READ_COMPANY_REPOSITORY } from '@src/modules/manage/application/constants/inject-key.const';
import { Inject } from '@nestjs/common';
import { CompanyEntity } from '@src/modules/manage/domain/entities/company.entity';
import { IReadCompanyRepository } from '@src/modules/manage/domain/ports/output/company-repository.interface';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { CompanyId } from '@src/modules/manage/domain/value-objects/company-id.vo';
import { GetOneReportQuery } from '../get-one-report.query';

@QueryHandler(GetOneReportQuery)
export class GetOneReportQueryHandler
  implements IQueryHandler<GetOneReportQuery, ResponseResult<CompanyEntity>>
{
  constructor(
    @Inject(READ_COMPANY_REPOSITORY)
    private readonly _readRepo: IReadCompanyRepository,
  ) {}

  async execute(
    query: GetOneReportQuery,
  ): Promise<ResponseResult<CompanyEntity>> {
    const companyId = new CompanyId(query.id);
    // console.log('companyId', companyId);
    return await this._readRepo.findOneReport(companyId, query.manager);
  }
}
