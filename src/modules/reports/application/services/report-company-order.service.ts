import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { IReportCompanyServiceInterface } from '../../domain/ports/input/report-company-order-domain-service.interface';
import { GetReportCompanyQuery } from '../queries/reportCompany/report-company.query';
import { CompanyQueryDto } from '@src/modules/manage/application/dto/query/company-query.dto';

@Injectable()
export class ReportCompanyService implements IReportCompanyServiceInterface {
  constructor(
    private readonly _queryBus: QueryBus,
    @InjectEntityManager(process.env.CONNECTION_NAME)
    private readonly _readEntityManager: EntityManager,
  ) {}
  reportCompany(manager?: EntityManager): Promise<any> {
    // console.log('hello world');
    return this._queryBus.execute(
      new GetReportCompanyQuery(manager ?? this._readEntityManager),
    );
  }
}
