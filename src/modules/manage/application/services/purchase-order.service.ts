import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { PurchaseOrderQueryDto } from '../dto/query/purchase-order.dto';
import { PurchaseOrderEntity } from '../../domain/entities/purchase-order.entity';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { IPurchaseOrderServiceInterface } from '../../domain/ports/input/purchase-order-domain-service.interface';
import { GetAllQuery } from '../queries/purchaseOrder/get-all.query';
import { GetOneQuery } from '../queries/purchaseOrder/get-one.query';
import { CreatePurchaseOrderDto } from '../dto/create/purchaseOrder/create.dto';
import { CreateCommand } from '../commands/purchaseOrder/create.command';

@Injectable()
export class PurchaseOrderService implements IPurchaseOrderServiceInterface {
  constructor(
    private readonly _queryBus: QueryBus,
    private readonly _commandBus: CommandBus,
    @InjectEntityManager(process.env.CONNECTION_NAME)
    private readonly _readEntityManager: EntityManager,
  ) {}

  async getAll(
    dto: PurchaseOrderQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<PurchaseOrderEntity>> {
    return await this._queryBus.execute(
      new GetAllQuery(dto, manager ?? this._readEntityManager),
    );
  }

  async getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<PurchaseOrderEntity>> {
    return await this._queryBus.execute(
      new GetOneQuery(id, manager ?? this._readEntityManager),
    );
  }

  async create(
    dto: CreatePurchaseOrderDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<PurchaseOrderEntity>> {
    return await this._commandBus.execute(
      new CreateCommand(dto, manager ?? this._readEntityManager),
    );
  }
}
