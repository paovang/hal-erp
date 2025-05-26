import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { IDocumentTypeServiceInterface } from '../../domain/ports/input/document-type-domain-service.interface';
import { CreateDocumentTypeDto } from '../dto/create/documentType/create.dto';
import { DocumentTypeEntity } from '../../domain/entities/document-type.entity';
import { CreateCommand } from '../commands/documentType/create.command';
import { DocumentTypeQueryDto } from '../dto/query/document-type-query.dto';
import { GetAllQuery } from '../queries/documentType/get-all.query';
import { GetOneQuery } from '../queries/documentType/get-one.query';
import { UpdateDocumentTypeDto } from '../dto/create/documentType/update.dto';
import { UpdateCommand } from '../commands/documentType/update.command';
import { DeleteCommand } from '../commands/documentType/delete.command';

@Injectable()
export class DocumentTypeService implements IDocumentTypeServiceInterface {
  constructor(
    private readonly _queryBus: QueryBus,
    private readonly _commandBus: CommandBus,
    @InjectEntityManager(process.env.CONNECTION_NAME)
    private readonly _readEntityManager: EntityManager,
  ) {}

  async getAll(
    dto: DocumentTypeQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<DocumentTypeEntity>> {
    return await this._queryBus.execute(
      new GetAllQuery(dto, manager ?? this._readEntityManager),
    );
  }

  async getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<DocumentTypeEntity>> {
    return await this._queryBus.execute(
      new GetOneQuery(id, manager ?? this._readEntityManager),
    );
  }

  async create(
    dto: CreateDocumentTypeDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<DocumentTypeEntity>> {
    return await this._commandBus.execute(
      new CreateCommand(dto, manager ?? this._readEntityManager),
    );
  }

  async update(
    id: number,
    dto: UpdateDocumentTypeDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<DocumentTypeEntity>> {
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
