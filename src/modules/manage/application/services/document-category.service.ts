import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { DocumentTypeEntity } from '../../domain/entities/document-type.entity';
import { GetAllQuery } from '../queries/documentCategory/get-all.query';
import { UpdateDocumentTypeDto } from '../dto/create/documentType/update.dto';
import { UpdateCommand } from '../commands/documentType/update.command';
import { IDocumentCategoryServiceInterface } from '../../domain/ports/input/document-category-domain-service.interface';
import { DocumentCategoryEntity } from '../../domain/entities/document-category.entity';

@Injectable()
export class DocumentCategoryService
  implements IDocumentCategoryServiceInterface
{
  constructor(
    private readonly _queryBus: QueryBus,
    private readonly _commandBus: CommandBus,
    @InjectEntityManager(process.env.CONNECTION_NAME)
    private readonly _readEntityManager: EntityManager,
  ) {}

  async getAll(
    manager?: EntityManager,
  ): Promise<ResponseResult<DocumentCategoryEntity>> {
    return await this._queryBus.execute(
      new GetAllQuery(manager ?? this._readEntityManager),
    );
  }

  async update(
    id: number,
    dto: UpdateDocumentTypeDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<DocumentCategoryEntity>> {
    return await this._commandBus.execute(
      new UpdateCommand(id, dto, manager ?? this._readEntityManager),
    );
  }
}
