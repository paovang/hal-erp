import { Injectable } from '@nestjs/common';
import { ICompanyVendorServiceInterface } from '../../domain/ports/input/company-vendor-domain-service.interface';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { CreateCompanyVendorDto } from '../dto/create/company-vendor/create.dto';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { CompanyVendorEntity } from '../../domain/entities/company-vendor.entity';
import { CreateCommand } from '../commands/company-vendor/create.command';
import { CompanyVendorQueryDto } from '../dto/query/company-vendor-query.dto';
import { GetAllQuery } from '../queries/company-vendor/get-all.query';
import { GetOneQuery } from '../queries/company-vendor/get-one.query';
import { UpdateCompanyVendorDto } from '../dto/create/company-vendor/update.dto';
import { UpdateCommand } from '../commands/company-vendor/update.command';
import { DeleteCommand } from '../commands/company-vendor/delete.command';

@Injectable()
export class CompanyVendorService implements ICompanyVendorServiceInterface {
  constructor(
    private readonly _queryBus: QueryBus,
    private readonly _commandBus: CommandBus,
    @InjectEntityManager(process.env.CONNECTION_NAME)
    private readonly _readEntityManager: EntityManager,
  ) {}

  async create(
    dto: CreateCompanyVendorDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<CompanyVendorEntity>> {
    return await this._commandBus.execute(
      new CreateCommand(dto, manager ?? this._readEntityManager),
    );
  }

  async getAll(
    dto: CompanyVendorQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<CompanyVendorEntity>> {
    return await this._queryBus.execute(
      new GetAllQuery(dto, manager ?? this._readEntityManager),
    );
  }

  async getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<CompanyVendorEntity>> {
    return await this._queryBus.execute(
      new GetOneQuery(id, manager ?? this._readEntityManager),
    );
  }

  async update(
    id: number,
    dto: UpdateCompanyVendorDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<CompanyVendorEntity>> {
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
