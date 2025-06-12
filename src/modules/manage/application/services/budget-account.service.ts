import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { InjectEntityManager } from '@nestjs/typeorm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { EntityManager } from 'typeorm';
import { IBudgetAccountServiceInterface } from '../../domain/ports/input/budget-account-service.interface';
import { CreateBudgetAccountDto } from '../dto/create/budgetAccount/create.dto';
import { BudgetAccountEntity } from '../../domain/entities/budget-account.entity';
import { CreateCommand } from '../commands/BudgetAccount/create.command';
import { BudgetAccountQueryDto } from '../dto/query/budget-account.dto';
import { GetAllQuery } from '../queries/BudgetAccount/get-all.query';
import { GetOneQuery } from '../queries/BudgetAccount/get-one.query';
import { UpdateBudgetAccountDto } from '../dto/create/budgetAccount/update.dto';
import { UpdateCommand } from '../commands/BudgetAccount/update.command';
import { DeleteCommand } from '../commands/BudgetAccount/delete.command';

@Injectable()
export class BudgetAccountService implements IBudgetAccountServiceInterface {
  constructor(
    private readonly _queryBus: QueryBus,
    private readonly _commandBus: CommandBus,
    @InjectEntityManager(process.env.CONNECTION_NAME)
    private readonly _readEntityManager: EntityManager,
  ) {}

  async create(
    dto: CreateBudgetAccountDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<BudgetAccountEntity>> {
    return await this._commandBus.execute(
      new CreateCommand(dto, manager ?? this._readEntityManager),
    );
  }

  async getAll(
    dto: BudgetAccountQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<BudgetAccountEntity>> {
    return await this._queryBus.execute(
      new GetAllQuery(dto, manager ?? this._readEntityManager),
    );
  }

  async getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<BudgetAccountEntity>> {
    return await this._queryBus.execute(
      new GetOneQuery(id, manager ?? this._readEntityManager),
    );
  }

  async update(
    id: number,
    dto: UpdateBudgetAccountDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<BudgetAccountEntity>> {
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
