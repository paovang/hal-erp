import { Injectable } from '@nestjs/common';
import { ICompanyProductServiceInterface } from '../../domain/ports/input/company-product-domain-service.interface';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { CreateCompanyProductDto } from '../dto/create/company-product/create.dto';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { CompanyProductEntity } from '../../domain/entities/company-product.entity';
import { CreateCommand } from '../commands/company-product/create.command';
import { CompanyProductQueryDto } from '../dto/query/company-product-query.dto';
import { GetAllQuery } from '../queries/company-product/get-all.query';
import { GetOneQuery } from '../queries/company-product/get-one.query';
import { UpdateCompanyProductDto } from '../dto/create/company-product/update.dto';
import { UpdateCommand } from '../commands/company-product/update.command';
import { DeleteCommand } from '../commands/company-product/delete.command';

@Injectable()
export class CompanyProductService implements ICompanyProductServiceInterface {
  constructor(
    private readonly _queryBus: QueryBus,
    private readonly _commandBus: CommandBus,
    @InjectEntityManager(process.env.CONNECTION_NAME)
    private readonly _readEntityManager: EntityManager,
  ) {}

  async create(
    dto: CreateCompanyProductDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<CompanyProductEntity>> {
    return await this._commandBus.execute(
      new CreateCommand(dto, manager ?? this._readEntityManager),
    );
  }

  async getAll(
    dto: CompanyProductQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<CompanyProductEntity>> {
    return await this._queryBus.execute(
      new GetAllQuery(dto, manager ?? this._readEntityManager),
    );
  }

  async getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<CompanyProductEntity>> {
    return await this._queryBus.execute(
      new GetOneQuery(id, manager ?? this._readEntityManager),
    );
  }

  async update(
    id: number,
    dto: UpdateCompanyProductDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<CompanyProductEntity>> {
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
