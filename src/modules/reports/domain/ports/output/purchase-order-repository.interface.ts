import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { EntityManager } from 'typeorm';
import { ReportPurchaseOrderEntity } from '../../entities/report-purchase-order.entity';
import { PurchaseOrderReportQueryDto } from '@src/modules/reports/application/dto/query/purchase-order-report.query.dto';

export interface IReportPurchaseOrderRepository {
  reportMoneyByPagination(
    dto: PurchaseOrderReportQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<any>>;
  report(
    query: PurchaseOrderReportQueryDto,
    manager: EntityManager,
    company_id?: number,
    roles?: string[],
    department_id?: number,
  ): Promise<ResponseResult<ReportPurchaseOrderEntity>>;

  reportMoney(manager: EntityManager): Promise<any>;
}
