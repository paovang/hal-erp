import { Injectable } from '@nestjs/common';
import { ICurrencyServiceInterface } from '../../domain/ports/input/currency-domain-service.interface';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { CreateCurrencyDto } from '../dto/create/currency/create.dto';
import { CurrencyEntity } from '../../domain/entities/currency.entity';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CreateCommand } from '../commands/currency/create.command';
import { CurrencyQueryDto } from '../dto/query/currency-query.dto';
import { GetAllQuery } from '../queries/currency/get-all.query';
import { GetOneQuery } from '../queries/currency/get-one.query';
import { UpdateCurrencyDto } from '../dto/create/currency/update.dto';
import { UpdateCommand } from '../commands/currency/update.command';
import { DeleteCommand } from '../commands/currency/delete.command';

@Injectable()
export class CurrencyService implements ICurrencyServiceInterface {
  constructor(
    private readonly _queryBus: QueryBus,
    private readonly _commandBus: CommandBus,
    @InjectEntityManager(process.env.CONNECTION_NAME)
    private readonly _readEntityManager: EntityManager,
  ) {}

  async create(
    dto: CreateCurrencyDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<CurrencyEntity>> {
    return await this._commandBus.execute(
      new CreateCommand(dto, manager ?? this._readEntityManager),
    );
  }

  async getAll(
    dto: CurrencyQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<CurrencyEntity>> {
    return await this._queryBus.execute(
      new GetAllQuery(dto, manager ?? this._readEntityManager),
    );
  }

  async getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<CurrencyEntity>> {
    return await this._queryBus.execute(
      new GetOneQuery(id, manager ?? this._readEntityManager),
    );
  }

  async update(
    id: number,
    dto: UpdateCurrencyDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<CurrencyEntity>> {
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
