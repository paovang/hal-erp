import { Injectable } from '@nestjs/common';
import { IDocumentStatusServiceInterface } from '../../domain/ports/input/document-status-domain-service.interface';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { DocumentStatusQueryDto } from '../dto/query/document-status.dto';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { DocumentStatusEntity } from '../../domain/entities/document-status.entity';
import { GetAllQuery } from '../queries/documentStatus/get-all.query';

@Injectable()
export class DocumentStatusService implements IDocumentStatusServiceInterface {
  constructor(
    private readonly _queryBus: QueryBus,
    private readonly _commandBus: CommandBus,
    @InjectEntityManager(process.env.CONNECTION_NAME)
    private readonly _readEntityManager: EntityManager,
  ) {}

  async getAll(
    query: DocumentStatusQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<DocumentStatusEntity>> {
    return await this._queryBus.execute(
      new GetAllQuery(query, manager ?? this._readEntityManager),
    );
  }
}
