import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ICompanyServiceInterface } from '@src/modules/manage/domain/ports/input/company-domain-service.interface';
import { GetAllQuery } from '@src/modules/manage/application/queries/company/get-all.query';
import { CompanyQueryDto } from '@src/modules/manage/application/dto/query/company-query.dto';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { CompanyEntity } from '@src/modules/manage/domain/entities/company.entity';
import { CreateCompanyDto } from '@src/modules/manage/application/dto/create/company/create.dto';
import { CreateCommand } from '@src/modules/manage/application/commands/company/create.command';
import { UpdateCommand } from '@src/modules/manage/application/commands/company/update.command';
import { UpdateCompanyDto } from '@src/modules/manage/application/dto/create/company/update.dto';
import { DeleteCommand } from '@src/modules/manage/application/commands/company/delete.command';
import { GetOneQuery } from '@src/modules/manage/application/queries/company/get-one.query';
import { GetOneReportQuery } from '../queries/company/get-one-report.query';
import { GetReportQuery } from '../queries/company/get-report-company.query';
import { ReportCompanyInterface } from '@src/common/application/interfaces/report-company.intergace';
import { GetReportReceiptQuery } from '../queries/company/get-report-receipt.query';
@Injectable()
export class CompanyService implements ICompanyServiceInterface {
  constructor(
    private readonly _queryBus: QueryBus,
    private readonly _commandBus: CommandBus,
    @InjectEntityManager(process.env.CONNECTION_NAME)
    private readonly _readEntityManager: EntityManager,
  ) {}

  async getAll(
    dto: CompanyQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<CompanyEntity>> {
    return await this._queryBus.execute(
      new GetAllQuery(dto, manager ?? this._readEntityManager),
    );
  }

  async getReport(
    manager?: EntityManager,
  ): Promise<ResponseResult<ReportCompanyInterface>> {
    return await this._queryBus.execute(
      new GetReportQuery(manager ?? this._readEntityManager),
    );
  }

  async getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<CompanyEntity>> {
    return await this._queryBus.execute(
      new GetOneQuery(id, manager ?? this._readEntityManager),
    );
  }

  async getOneReport(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<any>> {
    return await this._queryBus.execute(
      new GetOneReportQuery(id, manager ?? this._readEntityManager),
    );
  }

  async getReportReceipt(
    query: CompanyQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<CompanyEntity>> {
    return await this._queryBus.execute(
      new GetReportReceiptQuery(query, manager ?? this._readEntityManager),
    );
  }

  async create(
    dto: CreateCompanyDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<CompanyEntity>> {
    return await this._commandBus.execute(
      new CreateCommand(dto, manager ?? this._readEntityManager),
    );
  }

  async update(
    id: number,
    dto: UpdateCompanyDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<CompanyEntity>> {
    return await this._commandBus.execute(
      new UpdateCommand(id, dto, manager ?? this._readEntityManager),
    );
  }

  async delete(id: number, manager?: EntityManager): Promise<void> {
    return await this._commandBus.execute(
      new DeleteCommand(id, manager ?? this._readEntityManager),
    );
  }
}
