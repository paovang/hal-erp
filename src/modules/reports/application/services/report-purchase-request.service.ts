import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { IReportPurchaseRequestServiceInterface } from '../../domain/ports/input/report-purchase-request-domain-service.interface';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ReportPurchaseRequestEntity } from '../../domain/entities/report-purchase-request.entity.';
import { GetReportQuery } from '../queries/reportPurchaseRequest/report.query';
import { PurchaseRequestReportQueryDto } from '../dto/query/purchase-request-report.query.dto';
import { GetReportMoneyQuery } from '../queries/reportPurchaseRequest/report-money.query';

@Injectable()
export class ReportPurchaseRequestService
  implements IReportPurchaseRequestServiceInterface
{
  constructor(
    private readonly _queryBus: QueryBus,
    // private readonly _commandBus: CommandBus,
    @InjectEntityManager(process.env.CONNECTION_NAME)
    private readonly _readEntityManager: EntityManager,
  ) {}

  async report(
    dto: PurchaseRequestReportQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ReportPurchaseRequestEntity>> {
    return await this._queryBus.execute(
      new GetReportQuery(dto, manager ?? this._readEntityManager),
    );
  }

  async reportMoney(manager?: EntityManager): Promise<any> {
    return await this._queryBus.execute(
      new GetReportMoneyQuery(manager ?? this._readEntityManager),
    );
  }
}
