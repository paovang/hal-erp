import { EntityManager } from 'typeorm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ReportPurchaseRequestEntity } from '../../entities/report-purchase-request.entity.';
import { PurchaseRequestReportQueryDto } from '@src/modules/reports/application/dto/query/purchase-request-report.query.dto';

export interface IReportPurchaseRequestServiceInterface {
  report(
    dto: PurchaseRequestReportQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ReportPurchaseRequestEntity>>;

  reportMoney(manager?: EntityManager): Promise<any>;

  reportMoneyByPagination(
    dto: PurchaseRequestReportQueryDto,
    manager?: EntityManager,
  ): Promise<any>;

  getProcurementStatistics(manager?: EntityManager): Promise<any>;
}
