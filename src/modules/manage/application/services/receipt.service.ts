import { Injectable } from '@nestjs/common';
import { IReceiptServiceInterface } from '../../domain/ports/input/receipt-domain-service.interface';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { CreateReceiptDto } from '../dto/create/receipt/create.dto';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ReceiptEntity } from '../../domain/entities/receipt.entity';
import { CreateCommand } from '../commands/receipt/create.command';
import { ReceiptQueryDto } from '../dto/query/receipt.dto';
import { GetAllQuery } from '../queries/receipt/get-all.query';
import { GetOneQuery } from '../queries/receipt/get-one.query';
import { UpdateReceiptDto } from '../dto/create/receipt/update.dto';
import { UpdateCommand } from '../commands/receipt/update.command';
import { DeleteCommand } from '../commands/receipt/delete.command';

@Injectable()
export class ReceiptService implements IReceiptServiceInterface {
  constructor(
    private readonly _queryBus: QueryBus,
    private readonly _commandBus: CommandBus,
    @InjectEntityManager(process.env.CONNECTION_NAME)
    private readonly _readEntityManager: EntityManager,
  ) {}

  async getAll(
    dto: ReceiptQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ReceiptEntity>> {
    return await this._queryBus.execute(
      new GetAllQuery(dto, manager ?? this._readEntityManager),
    );
  }

  async getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<ReceiptEntity>> {
    return await this._queryBus.execute(
      new GetOneQuery(id, manager ?? this._readEntityManager),
    );
  }

  async create(
    dto: CreateReceiptDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ReceiptEntity>> {
    return await this._commandBus.execute(
      new CreateCommand(dto, manager ?? this._readEntityManager),
    );
  }

  async update(
    id: number,
    dto: UpdateReceiptDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ReceiptEntity>> {
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
