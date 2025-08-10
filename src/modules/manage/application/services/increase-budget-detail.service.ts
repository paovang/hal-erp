import { Injectable } from '@nestjs/common';
import { IIncreaseBudgetDetailServiceInterface } from '../../domain/ports/input/increase-budget-detail-domain.interface';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { CreateIncreaseBudgetDetailDto } from '../dto/create/increaseBudgetDetail/create.dto';
import { IncreaseBudgetDetailEntity } from '../../domain/entities/increase-budget-detail.entity';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CreateCommand } from '../commands/increaseBudgetDetail/create.command';
import { IncreaseBudgetDetailQueryDto } from '../dto/query/increase-budget-detail.dto';
import { GetAllQuery } from '../queries/increaseBudgetDetail/get-all.query';
import { UpdateIncreaseBudgetDetailDto } from '../dto/create/increaseBudgetDetail/update.dto';
import { UpdateCommand } from '../commands/increaseBudgetDetail/update.command';
import { GetOneQuery } from '../queries/increaseBudgetDetail/get-one.query';
import { DeleteCommand } from '../commands/increaseBudgetDetail/delete.command';

@Injectable()
export class IncreaseBudgetDetailService
  implements IIncreaseBudgetDetailServiceInterface
{
  constructor(
    private readonly _queryBus: QueryBus,
    private readonly _commandBus: CommandBus,
    @InjectEntityManager(process.env.CONNECTION_NAME)
    private readonly _readEntityManager: EntityManager,
  ) {}

  async getAll(
    id: number,
    dto: IncreaseBudgetDetailQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<IncreaseBudgetDetailEntity>> {
    return await this._queryBus.execute(
      new GetAllQuery(id, dto, manager ?? this._readEntityManager),
    );
  }

  async getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<IncreaseBudgetDetailEntity>> {
    return await this._queryBus.execute(
      new GetOneQuery(id, manager ?? this._readEntityManager),
    );
  }

  async create(
    id: number,
    dto: CreateIncreaseBudgetDetailDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<IncreaseBudgetDetailEntity>> {
    return await this._commandBus.execute(
      new CreateCommand(id, dto, manager ?? this._readEntityManager),
    );
  }

  async update(
    id: number,
    dto: UpdateIncreaseBudgetDetailDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<IncreaseBudgetDetailEntity>> {
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
