import { EntityManager } from 'typeorm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ReportPurchaseOrderEntity } from '../../entities/report-purchase-order.entity';
import { PurchaseOrderReportQueryDto } from '@src/modules/reports/application/dto/query/purchase-order-report.query.dto';

export interface IReportPurchaseOrderServiceInterface {
  report(
    dto: PurchaseOrderReportQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ReportPurchaseOrderEntity>>;

  reportMoney(manager?: EntityManager): Promise<any>;

  reportMoneyByPagination(
    dto: PurchaseOrderReportQueryDto,
    manager?: EntityManager,
  ): Promise<any>;
}
