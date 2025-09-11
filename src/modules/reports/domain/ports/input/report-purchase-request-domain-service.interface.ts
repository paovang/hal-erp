import { EntityManager } from 'typeorm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ReportPurchaseRequestEntity } from '../../entities/report-purchase-request.entity.';

export interface IReportPurchaseRequestServiceInterface {
  report(
    dto: any,
    manager?: EntityManager,
  ): Promise<ResponseResult<ReportPurchaseRequestEntity>>;
}
