import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { EntityManager } from 'typeorm';
import { ReportPurchaseRequestEntity } from '../../entities/report-purchase-request.entity.';
import { PurchaseRequestReportQueryDto } from '@src/modules/reports/application/dto/query/purchase-request-report.query.dto';

export interface IReportPurchaseRequestRepository {
  // findAll(
  //   query: PurchaseRequestQueryDto,
  //   manager: EntityManager,
  //   departmentId?: number,
  //   user_id?: number,
  //   roles?: string[],
  // ): Promise<ResponseResult<ReportPurchaseRequestEntity>>;

  report(
    query: PurchaseRequestReportQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<ReportPurchaseRequestEntity>>;

  reportMoney(manager: EntityManager): Promise<any>;
}
