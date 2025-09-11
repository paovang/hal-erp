import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ReportPurchaseRequestEntity } from '@src/modules/reports/domain/entities/report-purchase-request.entity.';
import { REPORT_PURCHASE_REQUEST_REPOSITORY } from '../../../constants/inject-key.const';
import { UserContextService } from '@src/common/infrastructure/cls/cls.service';
import { GetReportQuery } from '../report.query';
import { Inject } from '@nestjs/common';
import { IReportPurchaseRequestRepository } from '@src/modules/reports/domain/ports/output/purchase-request-repository.interface';

@QueryHandler(GetReportQuery)
export class GetReportQueryHandler
  implements
    IQueryHandler<GetReportQuery, ResponseResult<ReportPurchaseRequestEntity>>
{
  constructor(
    @Inject(REPORT_PURCHASE_REQUEST_REPOSITORY)
    private readonly _readRepo: IReportPurchaseRequestRepository,
    private readonly _userContextService: UserContextService,
  ) {}

  async execute(
    query: GetReportQuery,
  ): Promise<ResponseResult<ReportPurchaseRequestEntity>> {
    return await this._readRepo.report(query, query.manager);
  }
}
