import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { CreateVendorDto } from '../dto/create/vendor/create.dto';
import { VendorEntity } from '../../domain/entities/vendor.entity';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CreateCommand } from '../commands/vendor/create.command';
import { IVendorServiceInterface } from '../../domain/ports/input/vendor-domain-service.interface';
import { VendorQueryDto } from '../dto/query/vendor-query.dto';
import { GetAllQuery } from '../queries/vendor/get-all.query';
import { GetOneQuery } from '../queries/vendor/get-one.query';
import { UpdateVendorDto } from '../dto/create/vendor/update.dto';
import { UpdateCommand } from '../commands/vendor/update.command';
import { DeleteCommand } from '../commands/vendor/delete.command';

@Injectable()
export class VendorService implements IVendorServiceInterface {
  constructor(
    private readonly _queryBus: QueryBus,
    private readonly _commandBus: CommandBus,
    @InjectEntityManager(process.env.CONNECTION_NAME)
    private readonly _readEntityManager: EntityManager,
  ) {}

  async create(
    dto: CreateVendorDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<VendorEntity>> {
    return await this._commandBus.execute(
      new CreateCommand(dto, manager ?? this._readEntityManager),
    );
  }

  async getAll(
    dto: VendorQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<VendorEntity>> {
    return await this._queryBus.execute(
      new GetAllQuery(dto, manager ?? this._readEntityManager),
    );
  }

  async getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<VendorEntity>> {
    return await this._queryBus.execute(
      new GetOneQuery(id, manager ?? this._readEntityManager),
    );
  }

  async update(
    id: number,
    dto: UpdateVendorDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<VendorEntity>> {
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
