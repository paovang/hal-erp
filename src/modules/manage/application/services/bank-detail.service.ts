import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { IBankServiceInterface } from '../../domain/ports/input/bank-domain-service.interface';
import { CreateBankDto } from '../dto/create/banks/create.dto';
import { BankEntity } from '../../domain/entities/bank.entity';
import { BankQueryDto } from '../dto/query/bank-query.dto';
import { CreateBankCommand } from '../commands/banks/create.command';
import { GetAllBankQuery } from '../queries/banks/get-all.query';
import { UpdateBankDto } from '../dto/create/banks/update.dto';
import { UpdateBankCommand } from '../commands/banks/update.command';
import { GetOneBankQuery } from '../queries/banks/get-one.query';
import { DeleteBankCommand } from '../commands/banks/delete.command';

@Injectable()
export class BankService implements IBankServiceInterface {
  constructor(
    private readonly _queryBus: QueryBus,
    private readonly _commandBus: CommandBus,
    @InjectEntityManager(process.env.CONNECTION_NAME)
    private readonly _readEntityManager: EntityManager,
  ) {}

  async create(
    dto: CreateBankDto,
    logo: any,
    manager?: EntityManager,
  ): Promise<ResponseResult<BankEntity>> {
    return await this._commandBus.execute(
      new CreateBankCommand(dto, logo, manager ?? this._readEntityManager),
    );
  }
  async update(
    id: number,
    dto: UpdateBankDto,
    logo: any,
    manager?: EntityManager,
  ): Promise<ResponseResult<BankEntity>> {
    return await this._commandBus.execute(
      new UpdateBankCommand(id, dto, logo, manager ?? this._readEntityManager),
    );
  }

  async getAll(
    dto: BankQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<BankEntity>> {
    return await this._queryBus.execute(
      new GetAllBankQuery(dto, manager ?? this._readEntityManager),
    );
  }

  async getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<BankEntity>> {
    return await this._queryBus.execute(
      new GetOneBankQuery(id, manager ?? this._readEntityManager),
    );
  }

  async delete(id: number, manager?: EntityManager): Promise<void> {
    return await this._commandBus.execute(
      new DeleteBankCommand(id, manager ?? this._readEntityManager),
    );
  }
}
