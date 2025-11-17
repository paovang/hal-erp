import { Injectable } from '@nestjs/common';
import { IQuotaCompanyServiceInterface } from '../../domain/ports/input/quota-company-domain-service.interface';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { CreateQuotaCompanyDto } from '../dto/create/QuotaCompany/create.dto';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { CreateCommand } from '../commands/QuotaCompany/create.command';
import { GetAllQuery } from '../queries/QuotaCompany/get-all.query';
import { GetOneQuery } from '../queries/QuotaCompany/get-one.query';
import { UpdateCommand } from '../commands/QuotaCompany/update.command';
import { DeleteCommand } from '../commands/QuotaCompany/delete.command';
import { QuotaCompanyEntity } from '../../domain/entities/quota-company.entity';
import { UpdateQuotaCompanyDto } from '../dto/create/QuotaCompany/update.dto';
import { QuotaCompanyQueryDto } from '../dto/query/quota-company.dto';

@Injectable()
export class QuotaCompanyService implements IQuotaCompanyServiceInterface {
  constructor(
    private readonly _queryBus: QueryBus,
    private readonly _commandBus: CommandBus,
    @InjectEntityManager(process.env.CONNECTION_NAME)
    private readonly _readEntityManager: EntityManager,
  ) {}

  async create(
    dto: CreateQuotaCompanyDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<QuotaCompanyEntity>> {
    return await this._commandBus.execute(
      new CreateCommand(dto, manager ?? this._readEntityManager),
    );
  }

  async getAll(
    dto: QuotaCompanyQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<QuotaCompanyEntity>> {
    return await this._queryBus.execute(
      new GetAllQuery(dto, manager ?? this._readEntityManager),
    );
  }

  async getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<QuotaCompanyEntity>> {
    return await this._queryBus.execute(
      new GetOneQuery(id, manager ?? this._readEntityManager),
    );
  }

  async update(
    id: number,
    dto: UpdateQuotaCompanyDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<QuotaCompanyEntity>> {
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
