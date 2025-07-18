import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { IVatServiceInterface } from '../../domain/ports/input/vat-domain-service.interface';
import { VatQueryDto } from '../dto/query/vat-query.dto';
import { VatEntity } from '../../domain/entities/vat.entity';
import { CreateVatDto } from '../dto/create/vat/create.dto';
import { UpdateVatDto } from '../dto/create/vat/update.dto';
import { CreateVatCommand } from '../commands/vat/create.command';
import { UpdateVatCommand } from '../commands/vat/update.command';
import { DeleteVatCommand } from '../commands/vat/delete.command';
import { GetAllVatQuery } from '../queries/vat/get-all.query';
import { GetOneVatQuery } from '../queries/vat/get-one.query';

@Injectable()
export class VatService implements IVatServiceInterface {
  constructor(
    private readonly _queryBus: QueryBus,
    private readonly _commandBus: CommandBus,
    @InjectEntityManager(process.env.CONNECTION_NAME)
    private readonly _readEntityManager: EntityManager,
  ) {}

  async getAll(
    dto: VatQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<VatEntity>> {
    return await this._queryBus.execute(
      new GetAllVatQuery(dto, manager ?? this._readEntityManager),
    );
  }

  async getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<VatEntity>> {
    return await this._queryBus.execute(
      new GetOneVatQuery(id, manager ?? this._readEntityManager),
    );
  }

  async create(
    dto: CreateVatDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<VatEntity>> {
    return await this._commandBus.execute(
      new CreateVatCommand(dto, manager ?? this._readEntityManager),
    );
  }

  async update(
    id: number,
    dto: UpdateVatDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<VatEntity>> {
    return await this._commandBus.execute(
      new UpdateVatCommand(id, dto, manager ?? this._readEntityManager),
    );
  }

  async delete(id: number, manager?: EntityManager): Promise<void> {
    return await this._commandBus.execute(
      new DeleteVatCommand(id, manager ?? this._readEntityManager),
    );
  }
}
