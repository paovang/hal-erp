import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { IReportPurchaseOrderServiceInterface } from '../../domain/ports/input/report-purchase-order-domain-service.interface';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ReportPurchaseOrderEntity } from '../../domain/entities/report-purchase-order.entity';
import { GetReportQuery } from '../queries/reportPurchaseOrder/report.query';
import { PurchaseOrderReportQueryDto } from '../dto/query/purchase-order-report.query.dto';
import { GetReportMoneyQuery } from '../queries/reportPurchaseOrder/report-money.query';
import { GetReportMoneyByPaginationQuery } from '../queries/reportPurchaseOrder/report-money-paginate.query';

@Injectable()
export class ReportPurchaseOrderService
  implements IReportPurchaseOrderServiceInterface
{
  constructor(
    private readonly _queryBus: QueryBus,
    @InjectEntityManager(process.env.CONNECTION_NAME)
    private readonly _readEntityManager: EntityManager,
  ) {}

  async report(
    dto: PurchaseOrderReportQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ReportPurchaseOrderEntity>> {
    return await this._queryBus.execute(
      new GetReportQuery(dto, manager ?? this._readEntityManager),
    );
  }

  async reportMoney(manager?: EntityManager): Promise<any> {
    return await this._queryBus.execute(
      new GetReportMoneyQuery(manager ?? this._readEntityManager),
    );
  }

  async reportMoneyByPagination(
    dto: PurchaseOrderReportQueryDto,
    manager?: EntityManager,
  ): Promise<any> {
    const result = await this._queryBus.execute(
      new GetReportMoneyByPaginationQuery(
        dto,
        manager ?? this._readEntityManager,
      ),
    );
    return result;
  }
}