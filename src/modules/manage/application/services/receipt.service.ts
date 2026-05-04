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
import { ReceiptExportQueryDto } from '../dto/query/receipt-export.dto';
import { GetAllQuery } from '../queries/receipt/get-all.query';
import { GetAllForExportQuery } from '../queries/receipt/get-all-for-export.query';
import { GetOneQuery } from '../queries/receipt/get-one.query';
import { UpdateReceiptDto } from '../dto/create/receipt/update.dto';
import { UpdateCommand } from '../commands/receipt/update.command';
import { DeleteCommand } from '../commands/receipt/delete.command';
import { GetPrintQuery } from '../queries/receipt/get-print.query';
import { ReceiptPrintResult } from '../../domain/ports/output/receipt-repository.interface';
import { ReceiptListExportRow } from '@src/common/utils/excel-export.service';

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

  async getAllForExport(
    dto: ReceiptExportQueryDto,
    manager?: EntityManager,
  ): Promise<ReceiptListExportRow[]> {
    return await this._queryBus.execute(
      new GetAllForExportQuery(dto, manager ?? this._readEntityManager),
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

  async getPrint(
    id: number,
    query: ReceiptQueryDto,
    manager?: EntityManager,
  ): Promise<ReceiptPrintResult> {
    return await this._queryBus.execute(
      new GetPrintQuery(id, query, manager ?? this._readEntityManager),
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
