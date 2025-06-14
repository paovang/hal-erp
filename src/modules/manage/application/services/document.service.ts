import { Injectable } from '@nestjs/common';
import { IDocumentServiceInterface } from '../../domain/ports/input/document-domain-service.interface';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { DocumentEntity } from '../../domain/entities/document.entity';
import { CreateCommand } from '../commands/Document/create.command';
import { GetAllQuery } from '../queries/Document/get-all.query';
import { GetOneQuery } from '../queries/Document/get-one.query';
import { UpdateCommand } from '../commands/Document/update.command';
import { DeleteCommand } from '../commands/Document/delete.command';
import { DocumentQueryDto } from '../dto/query/document.dto';
import { CreateDocumentDto } from '../dto/create/Document/create.dto';
import { UpdateDocumentDto } from '../dto/create/Document/update.dto';

@Injectable()
export class DocumentService implements IDocumentServiceInterface {
  constructor(
    private readonly _queryBus: QueryBus,
    private readonly _commandBus: CommandBus,
    @InjectEntityManager(process.env.CONNECTION_NAME)
    private readonly _readEntityManager: EntityManager,
  ) {}

  async getAll(
    dto: DocumentQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<DocumentEntity>> {
    return await this._queryBus.execute(
      new GetAllQuery(dto, manager ?? this._readEntityManager),
    );
  }

  async getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<DocumentEntity>> {
    return await this._queryBus.execute(
      new GetOneQuery(id, manager ?? this._readEntityManager),
    );
  }

  async create(
    dto: CreateDocumentDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<DocumentEntity>> {
    return await this._commandBus.execute(
      new CreateCommand(dto, manager ?? this._readEntityManager),
    );
  }

  async update(
    id: number,
    dto: UpdateDocumentDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<DocumentEntity>> {
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
