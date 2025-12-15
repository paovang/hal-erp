import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetReportMoneyByPaginationQuery } from '../report-money-paginate.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { REPORT_PURCHASE_ORDER_REPOSITORY } from '../../../constants/inject-key.const';
import { IReportPurchaseOrderRepository } from '@src/modules/reports/domain/ports/output/purchase-order-repository.interface';
import { UserContextService } from '@src/common/infrastructure/cls/cls.service';

@QueryHandler(GetReportMoneyByPaginationQuery)
export class GetReportMoneyByPaginationQueryHandler
  implements IQueryHandler<GetReportMoneyByPaginationQuery, ResponseResult<any>>
{
  constructor(
    @Inject(REPORT_PURCHASE_ORDER_REPOSITORY)
    private readonly _readRepo: IReportPurchaseOrderRepository,
    private readonly _userContextService: UserContextService,
  ) {}

  async execute(
    query: GetReportMoneyByPaginationQuery,
  ): Promise<ResponseResult<any>> {
    return await this._readRepo.reportMoneyByPagination(
      query.dto,
      query.manager,
    );
  }
}
