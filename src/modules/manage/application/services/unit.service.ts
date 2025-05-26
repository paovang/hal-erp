import { Injectable } from '@nestjs/common';
import { IUnitServiceInterface } from '../../domain/ports/input/unit-domain-service.interface';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { CreateUnitDto } from '../dto/create/unit/create.dto';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { UnitEntity } from '../../domain/entities/unit.entity';
import { CreateCommand } from '../commands/unit/create.command';
import { UnitQueryDto } from '../dto/query/unit-query.dto';
import { GetAllQuery } from '../queries/unit/get-all.query';
import { GetOneQuery } from '../queries/unit/get-one.query';
import { UpdateUnitDto } from '../dto/create/unit/update.dto';
import { UpdateCommand } from '../commands/unit/update.command';
import { DeleteCommand } from '../commands/unit/delete-command';

@Injectable()
export class UnitService implements IUnitServiceInterface {
  constructor(
    private readonly _queryBus: QueryBus,
    private readonly _commandBus: CommandBus,
    @InjectEntityManager(process.env.CONNECTION_NAME)
    private readonly _readEntityManager: EntityManager,
  ) {}

  async getAll(
    dto: UnitQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<UnitEntity>> {
    return await this._queryBus.execute(
      new GetAllQuery(dto, manager ?? this._readEntityManager),
    );
  }

  async getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<UnitEntity>> {
    return await this._queryBus.execute(
      new GetOneQuery(id, manager ?? this._readEntityManager),
    );
  }

  async create(
    dto: CreateUnitDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<UnitEntity>> {
    return await this._commandBus.execute(
      new CreateCommand(dto, manager ?? this._readEntityManager),
    );
  }

  async update(
    id: number,
    dto: UpdateUnitDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<UnitEntity>> {
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
