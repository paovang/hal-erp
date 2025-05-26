import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { CreatePositionDto } from '../dto/create/position/create.dto';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { PositionEntity } from '../../domain/entities/position.entity';
import { CreateCommand } from '../commands/position/create.command';
import { IPositionServiceInterface } from '../../domain/ports/input/position-domain-service.interface';
import { PositionQueryDto } from '../dto/query/position-query.dto';
import { GetAllQuery } from '../queries/position/get-all.query';
import { GetOneQuery } from '../queries/position/get-one.query';
import { UpdatePositionDto } from '../dto/create/position/update.dto';
import { UpdateCommand } from '../commands/position/update.command';
import { DeleteCommand } from '../commands/position/delete.command';

@Injectable()
export class PositionService implements IPositionServiceInterface {
  constructor(
    private readonly _queryBus: QueryBus,
    private readonly _commandBus: CommandBus,
    @InjectEntityManager(process.env.CONNECTION_NAME)
    private readonly _readEntityManager: EntityManager,
  ) {}

  async getAll(
    dto: PositionQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<PositionEntity>> {
    return await this._queryBus.execute(
      new GetAllQuery(dto, manager ?? this._readEntityManager),
    );
  }

  async getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<PositionEntity>> {
    return await this._queryBus.execute(
      new GetOneQuery(id, manager ?? this._readEntityManager),
    );
  }

  async create(
    dto: CreatePositionDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<PositionEntity>> {
    return await this._commandBus.execute(
      new CreateCommand(dto, manager ?? this._readEntityManager),
    );
  }

  async update(
    id: number,
    dto: UpdatePositionDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<PositionEntity>> {
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
