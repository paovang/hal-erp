import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetReportCompanyMoneyQuery } from '../report-company.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { Inject } from '@nestjs/common';
import { REPORT_RECEIPT_REPOSITORY } from '../../../constants/inject-key.const';
import { IReportReceiptRepository } from '@src/modules/reports/domain/ports/output/receipt-repository.interface';

@QueryHandler(GetReportCompanyMoneyQuery)
export class GetReportCompanyQueryHandler
  implements IQueryHandler<GetReportCompanyMoneyQuery, ResponseResult<any>>
{
  constructor(
    @Inject(REPORT_RECEIPT_REPOSITORY)
    private readonly _readRepo: IReportReceiptRepository,
  ) {}

  async execute(
    query: GetReportCompanyMoneyQuery,
  ): Promise<ResponseResult<any>> {
    return await this._readRepo.reportMoney(query.manager);
  }
}
