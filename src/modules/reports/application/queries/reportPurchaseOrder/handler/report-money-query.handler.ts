import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetReportMoneyQuery } from '../report-money.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { REPORT_PURCHASE_ORDER_REPOSITORY } from '../../../constants/inject-key.const';
import { UserContextService } from '@src/common/infrastructure/cls/cls.service';
import { IReportPurchaseOrderRepository } from '@src/modules/reports/domain/ports/output/purchase-order-repository.interface';
import { Inject } from '@nestjs/common';

@QueryHandler(GetReportMoneyQuery)
export class GetReportMoneyQueryHandler
  implements IQueryHandler<GetReportMoneyQuery, ResponseResult<any>>
{
  constructor(
    @Inject(REPORT_PURCHASE_ORDER_REPOSITORY)
    private readonly _readRepo: IReportPurchaseOrderRepository,
    private readonly _userContextService: UserContextService,
  ) {}

  async execute(query: GetReportMoneyQuery): Promise<ResponseResult<any>> {
    return await this._readRepo.reportMoney(query.manager);
  }
}