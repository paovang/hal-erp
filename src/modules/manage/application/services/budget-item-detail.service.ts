import { Injectable } from '@nestjs/common';
import { IBudgetItemDetailServiceInterface } from '../../domain/ports/input/budget-item-detail-domain-service.interface';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { CreateBudgetItemDetailDto } from '../dto/create/BudgetItemDetail/create.dto';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { BudgetItemDetailEntity } from '../../domain/entities/budget-item-detail.entity';
import { CreateCommand } from '../commands/BudgetItemDetail/create.command';
import { BudgetItemDetailQueryDto } from '../dto/query/budget-item-detail.dto';
import { GetAllQuery } from '../queries/BudgetItemDetail/get-all.query';
import { GetOneQuery } from '../queries/BudgetItemDetail/get-one.query';
import { DeleteCommand } from '../commands/BudgetItemDetail/delete.command';

@Injectable()
export class BudgetItemDetailService
  implements IBudgetItemDetailServiceInterface
{
  constructor(
    private readonly _queryBus: QueryBus,
    private readonly _commandBus: CommandBus,
    @InjectEntityManager(process.env.CONNECTION_NAME)
    private readonly _readEntityManager: EntityManager,
  ) {}

  async create(
    id: number,
    dto: CreateBudgetItemDetailDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<BudgetItemDetailEntity>> {
    return await this._commandBus.execute(
      new CreateCommand(id, dto, manager ?? this._readEntityManager),
    );
  }

  async getAll(
    id: number,
    dto: BudgetItemDetailQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<BudgetItemDetailEntity>> {
    return await this._queryBus.execute(
      new GetAllQuery(id, dto, manager ?? this._readEntityManager),
    );
  }

  async getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<BudgetItemDetailEntity>> {
    return await this._queryBus.execute(
      new GetOneQuery(id, manager ?? this._readEntityManager),
    );
  }

  async delete(id: number, manager?: EntityManager): Promise<void> {
    return await this._commandBus.execute(
      new DeleteCommand(id, manager ?? this._readEntityManager),
    );
  }
}
