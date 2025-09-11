import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { EntityManager } from 'typeorm';
import { ReportPurchaseRequestEntity } from '../../entities/report-purchase-request.entity.';

export interface IReportPurchaseRequestRepository {
  // findAll(
  //   query: PurchaseRequestQueryDto,
  //   manager: EntityManager,
  //   departmentId?: number,
  //   user_id?: number,
  //   roles?: string[],
  // ): Promise<ResponseResult<ReportPurchaseRequestEntity>>;

  report(
    query: any,
    manager: EntityManager,
    departmentId?: number,
    user_id?: number,
    roles?: string[],
  ): Promise<ResponseResult<ReportPurchaseRequestEntity>>;
}
