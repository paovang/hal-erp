import { Injectable } from '@nestjs/common';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { DocumentEntity } from '@src/modules/manage/domain/entities/document.entity';
import { IWriteDocumentRepository } from '@src/modules/manage/domain/ports/output/document-repository.interface';
import { EntityManager } from 'typeorm';
import { DocumentDataAccessMapper } from '../../mappers/document.mapper';
import { DocumentOrmEntity } from '@src/common/infrastructure/database/typeorm/document.orm';
import { DocumentId } from '@src/modules/manage/domain/value-objects/document-id.vo';

@Injectable()
export class WriteDocumentRepository implements IWriteDocumentRepository {
  constructor(private readonly _dataAccessMapper: DocumentDataAccessMapper) {}

  async create(
    entity: DocumentEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<DocumentEntity>> {
    return this._dataAccessMapper.toEntity(
      await manager.save(
        this._dataAccessMapper.toOrmEntity(entity, OrmEntityMethod.CREATE),
      ),
    );
  }

  async update(
    entity: DocumentEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<DocumentEntity>> {
    const OrmEntity = this._dataAccessMapper.toOrmEntity(
      entity,
      OrmEntityMethod.UPDATE,
    );

    try {
      await manager.update(DocumentOrmEntity, entity.getId().value, OrmEntity);

      return this._dataAccessMapper.toEntity(OrmEntity);
    } catch (error) {
      throw error;
    }
  }

  async delete(id: DocumentId, manager: EntityManager): Promise<void> {
    try {
      await manager.softDelete(DocumentOrmEntity, id.value);
    } catch (error) {
      throw error;
    }
  }
}
