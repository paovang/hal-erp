import { Injectable } from '@nestjs/common';
import { IReportReceiptServiceInterface } from '../../domain/ports/input/report-receipt-domain-service.interface';
import { QueryBus } from '@nestjs/cqrs';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { GetReportReceiptMoneyQuery } from '../queries/reportReceipt/report-money.query';

@Injectable()
export class ReportReceiptService implements IReportReceiptServiceInterface {
  constructor(
    private readonly _queryBus: QueryBus,
    @InjectEntityManager(process.env.CONNECTION_NAME)
    private readonly _readEntityManager: EntityManager,
  ) {}
  reportMoney(manager?: EntityManager): Promise<any> {
    return this._queryBus.execute(
      new GetReportReceiptMoneyQuery(manager ?? this._readEntityManager),
    );
  }
}
