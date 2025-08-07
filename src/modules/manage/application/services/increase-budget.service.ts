import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { IIncreaseBudgetServiceInterface } from '../../domain/ports/input/increase-budget-domain.interface';
import { CreateIncreaseBudgetDto } from '../dto/create/increaseBudgetFile/create.dto';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { IncreaseBudgetEntity } from '../../domain/entities/increase-budget.entity';
import { CreateCommand } from '../commands/increasebudget/create.command';

@Injectable()
export class IncreaseBudgetService implements IIncreaseBudgetServiceInterface {
  constructor(
    private readonly _queryBus: QueryBus,
    private readonly _commandBus: CommandBus,
    @InjectEntityManager(process.env.CONNECTION_NAME)
    private readonly _readEntityManager: EntityManager,
  ) {}

  //   async getAll(
  //     dto: PositionQueryDto,
  //     manager?: EntityManager,
  //   ): Promise<ResponseResult<PositionEntity>> {
  //     return await this._queryBus.execute(
  //       new GetAllQuery(dto, manager ?? this._readEntityManager),
  //     );
  //   }

  //   async getOne(
  //     id: number,
  //     manager?: EntityManager,
  //   ): Promise<ResponseResult<PositionEntity>> {
  //     return await this._queryBus.execute(
  //       new GetOneQuery(id, manager ?? this._readEntityManager),
  //     );
  //   }

  async create(
    dto: CreateIncreaseBudgetDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<IncreaseBudgetEntity>> {
    return await this._commandBus.execute(
      new CreateCommand(dto, manager ?? this._readEntityManager),
    );
  }

  //   async update(
  //     id: number,
  //     dto: UpdatePositionDto,
  //     manager?: EntityManager,
  //   ): Promise<ResponseResult<PositionEntity>> {
  //     return await this._commandBus.execute(
  //       new UpdateCommand(id, dto, manager ?? this._readEntityManager),
  //     );
  //   }

  //   async delete(id: number, manager?: EntityManager): Promise<void> {
  //     return await this._commandBus.execute(
  //       new DeleteCommand(id, manager ?? this._readEntityManager),
  //     );
  //   }
}
