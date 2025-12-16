import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { EntityManager } from 'typeorm';
import { ReportPurchaseRequestEntity } from '../../entities/report-purchase-request.entity.';
import { PurchaseRequestReportQueryDto } from '@src/modules/reports/application/dto/query/purchase-request-report.query.dto';

export interface IReportPurchaseRequestRepository {
  reportMoneyByPagination(
    dto: PurchaseRequestReportQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<any>>;
  report(
    query: PurchaseRequestReportQueryDto,
    manager: EntityManager,
    company_id?: number,
    roles?: string[],
    department_id?: number,
  ): Promise<ResponseResult<ReportPurchaseRequestEntity>>;

  reportMoney(
    manager: EntityManager,
    company_id?: number,
    roles?: string,
    department_id?: number,
  ): Promise<any>;

  getProcurementStatistics(manager: EntityManager): Promise<any>;
}
