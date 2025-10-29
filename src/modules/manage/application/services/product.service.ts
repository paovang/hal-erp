import { Injectable } from '@nestjs/common';
import { IProductServiceInterface } from '../../domain/ports/input/product-domain-service.interface';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { CreateProductDto } from '../dto/create/product/create.dto';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { ProductEntity } from '../../domain/entities/product.entity';
import { CreateCommand } from '../commands/product/create.command';
import { ProductQueryDto } from '../dto/query/product-query.dto';
import { GetAllQuery } from '../queries/product/get-all.query';
import { GetOneQuery } from '../queries/product/get-one.query';
import { UpdateProductDto } from '../dto/create/product/update.dto';
import { UpdateCommand } from '../commands/product/update.command';
import { DeleteCommand } from '../commands/product/delete.command';

@Injectable()
export class ProductService implements IProductServiceInterface {
  constructor(
    private readonly _queryBus: QueryBus,
    private readonly _commandBus: CommandBus,
    @InjectEntityManager(process.env.CONNECTION_NAME)
    private readonly _readEntityManager: EntityManager,
  ) {}

  async create(
    dto: CreateProductDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ProductEntity>> {
    return await this._commandBus.execute(
      new CreateCommand(dto, manager ?? this._readEntityManager),
    );
  }

  async getAll(
    dto: ProductQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ProductEntity>> {
    return await this._queryBus.execute(
      new GetAllQuery(dto, manager ?? this._readEntityManager),
    );
  }

  async getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<ProductEntity>> {
    return await this._queryBus.execute(
      new GetOneQuery(id, manager ?? this._readEntityManager),
    );
  }

  async update(
    id: number,
    dto: UpdateProductDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ProductEntity>> {
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