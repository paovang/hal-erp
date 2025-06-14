import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { IBudgetItemServiceInterface } from '../../domain/ports/input/budget-item-domain-service.interface';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { BudgetItemEntity } from '../../domain/entities/budget-item.entity';
import { CreateCommand } from '../commands/BudgetItem/create.command';
import { GetAllQuery } from '../queries/BudgetItem/get-all.query';
import { GetOneQuery } from '../queries/BudgetItem/get-one.query';
import { UpdateCommand } from '../commands/BudgetItem/update.command';
import { DeleteCommand } from '../commands/BudgetItem/delete.command';
import { CreateBudgetItemDto } from '../dto/create/budgetItem/create.dto';
import { BudgetItemQueryDto } from '../dto/query/budget-item.dto';
import { UpdateBudgetItemDto } from '../dto/create/budgetItem/update.dto';

@Injectable()
export class BudgetItemService implements IBudgetItemServiceInterface {
  constructor(
    private readonly _queryBus: QueryBus,
    private readonly _commandBus: CommandBus,
    @InjectEntityManager(process.env.CONNECTION_NAME)
    private readonly _readEntityManager: EntityManager,
  ) {}

  async create(
    dto: CreateBudgetItemDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<BudgetItemEntity>> {
    return await this._commandBus.execute(
      new CreateCommand(dto, manager ?? this._readEntityManager),
    );
  }

  async getAll(
    dto: BudgetItemQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<BudgetItemEntity>> {
    return await this._queryBus.execute(
      new GetAllQuery(dto, manager ?? this._readEntityManager),
    );
  }

  async getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<BudgetItemEntity>> {
    return await this._queryBus.execute(
      new GetOneQuery(id, manager ?? this._readEntityManager),
    );
  }

  async update(
    id: number,
    dto: UpdateBudgetItemDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<BudgetItemEntity>> {
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
