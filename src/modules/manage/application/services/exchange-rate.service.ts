import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { IExchangeRateServiceInterface } from '../../domain/ports/input/exchange-rate-domain-service.interface';
import { ExchangeRateEntity } from '../../domain/entities/exchange-rate.entity';
import { CreateExchangeRateCommand } from '../commands/exchange-rates/create.command';
import { CreateExchangeRateDto } from '../dto/create/exchange-rates/create.dto';
import { ExchangeRateQueryDto } from '../dto/query/exchange-rate-query.dto';
import { GetAllExchangeRateQuery } from '../queries/exchange-rates/get-all.query';
import { UpdateExchangeRateDto } from '../dto/create/exchange-rates/update.dto';
import { UpdateExchangeRateCommand } from '../commands/exchange-rates/update.command';
import { GetOneExchangeRateQuery } from '../queries/exchange-rates/get-one.query';
import { DeleteExchangeRateCommand } from '../commands/exchange-rates/delete.command';

@Injectable()
export class ExchangeRateService implements IExchangeRateServiceInterface {
  constructor(
    private readonly _queryBus: QueryBus,
    private readonly _commandBus: CommandBus,
    @InjectEntityManager(process.env.CONNECTION_NAME)
    private readonly _readEntityManager: EntityManager,
  ) {}

  async create(
    dto: CreateExchangeRateDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ExchangeRateEntity>> {
    return await this._commandBus.execute(
      new CreateExchangeRateCommand(dto, manager ?? this._readEntityManager),
    );
  }

  async getAll(
    dto: ExchangeRateQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ExchangeRateEntity>> {
    return await this._queryBus.execute(
      new GetAllExchangeRateQuery(dto, manager ?? this._readEntityManager),
    );
  }

  async getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<ExchangeRateEntity>> {
    return await this._queryBus.execute(
      new GetOneExchangeRateQuery(id, manager ?? this._readEntityManager),
    );
  }

  async update(
    id: number,
    dto: UpdateExchangeRateDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ExchangeRateEntity>> {
    return await this._commandBus.execute(
      new UpdateExchangeRateCommand(
        id,
        dto,
        manager ?? this._readEntityManager,
      ),
    );
  }

  async delete(id: number, manager?: EntityManager): Promise<void> {
    return await this._commandBus.execute(
      new DeleteExchangeRateCommand(id, manager ?? this._readEntityManager),
    );
  }
}
