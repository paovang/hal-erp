import { Injectable } from '@nestjs/common';
import { IVendorProductServiceInterface } from '../../domain/ports/input/vendor-product-domain-service.interface';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { CreateVendorProductDto } from '../dto/create/vendor-product/create.dto';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { VendorProductEntity } from '../../domain/entities/vendor-product.entity';
import { CreateCommand } from '../commands/vendor-product/create.command';
import { VendorProductQueryDto } from '../dto/query/vendor-product-query.dto';
import { GetAllQuery } from '../queries/vendor-product/get-all.query';
import { GetOneQuery } from '../queries/vendor-product/get-one.query';
import { UpdateVendorProductDto } from '../dto/create/vendor-product/update.dto';
import { UpdateCommand } from '../commands/vendor-product/update.command';
import { DeleteCommand } from '../commands/vendor-product/delete.command';

@Injectable()
export class VendorProductService implements IVendorProductServiceInterface {
  constructor(
    private readonly _queryBus: QueryBus,
    private readonly _commandBus: CommandBus,
    @InjectEntityManager(process.env.CONNECTION_NAME)
    private readonly _readEntityManager: EntityManager,
  ) {}

  async create(
    dto: CreateVendorProductDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<VendorProductEntity>> {
    return await this._commandBus.execute(
      new CreateCommand(dto, manager ?? this._readEntityManager),
    );
  }

  async getAll(
    dto: VendorProductQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<VendorProductEntity>> {
    return await this._queryBus.execute(
      new GetAllQuery(dto, manager ?? this._readEntityManager),
    );
  }

  async getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<VendorProductEntity>> {
    return await this._queryBus.execute(
      new GetOneQuery(id, manager ?? this._readEntityManager),
    );
  }

  async update(
    id: number,
    dto: UpdateVendorProductDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<VendorProductEntity>> {
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
