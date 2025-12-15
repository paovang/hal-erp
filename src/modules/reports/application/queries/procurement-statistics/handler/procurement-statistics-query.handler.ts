import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProcurementStatisticsQuery } from '../procurement-statistics.query';
import { REPORT_PURCHASE_REQUEST_REPOSITORY } from '../../../constants/inject-key.const';
import { UserContextService } from '@src/common/infrastructure/cls/cls.service';
import { IReportPurchaseRequestRepository } from '@src/modules/reports/domain/ports/output/purchase-request-repository.interface';
import { Inject } from '@nestjs/common';

@QueryHandler(GetProcurementStatisticsQuery)
export class GetProcurementStatisticsQueryHandler
  implements IQueryHandler<GetProcurementStatisticsQuery, any>
{
  constructor(
    @Inject(REPORT_PURCHASE_REQUEST_REPOSITORY)
    private readonly _readRepo: IReportPurchaseRequestRepository,
    private readonly _userContextService: UserContextService,
  ) {}

  async execute(query: GetProcurementStatisticsQuery): Promise<any> {
    return await this._readRepo.getProcurementStatistics(query.manager);
  }
}
