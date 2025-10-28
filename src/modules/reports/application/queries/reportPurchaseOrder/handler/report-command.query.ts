import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ReportPurchaseOrderEntity } from '@src/modules/reports/domain/entities/report-purchase-order.entity';
import { REPORT_PURCHASE_ORDER_REPOSITORY } from '../../../constants/inject-key.const';
import { UserContextService } from '@src/common/infrastructure/cls/cls.service';
import { GetReportQuery } from '../report.query';
import { Inject } from '@nestjs/common';
import { IReportPurchaseOrderRepository } from '@src/modules/reports/domain/ports/output/purchase-order-repository.interface';

@QueryHandler(GetReportQuery)
export class GetReportQueryHandler
  implements
    IQueryHandler<GetReportQuery, ResponseResult<ReportPurchaseOrderEntity>>
{
  constructor(
    @Inject(REPORT_PURCHASE_ORDER_REPOSITORY)
    private readonly _readRepo: IReportPurchaseOrderRepository,
    private readonly _userContextService: UserContextService,
  ) {}

  async execute(
    query: GetReportQuery,
  ): Promise<ResponseResult<ReportPurchaseOrderEntity>> {
    return await this._readRepo.report(query.dto, query.manager);
  }
}
