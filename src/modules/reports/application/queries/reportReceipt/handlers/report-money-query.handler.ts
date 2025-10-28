import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetReportReceiptMoneyQuery } from '../report-money.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { Inject } from '@nestjs/common';
import { REPORT_RECEIPT_REPOSITORY } from '../../../constants/inject-key.const';
import { UserContextService } from '@src/common/infrastructure/cls/cls.service';
import { IReportReceiptRepository } from '@src/modules/reports/domain/ports/output/receipt-repository.interface';

@QueryHandler(GetReportReceiptMoneyQuery)
export class GetReportReceiptMoneyQueryHandler
  implements IQueryHandler<GetReportReceiptMoneyQuery, ResponseResult<any>>
{
  constructor(
    @Inject(REPORT_RECEIPT_REPOSITORY)
    private readonly _readRepo: IReportReceiptRepository,
    private readonly _userContextService: UserContextService,
  ) {}

  async execute(
    query: GetReportReceiptMoneyQuery,
  ): Promise<ResponseResult<any>> {
    return await this._readRepo.reportMoney(query.manager);
  }
}
