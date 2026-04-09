import { Injectable } from '@nestjs/common';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { DocumentTypeEntity } from '@src/modules/manage/domain/entities/document-type.entity';
import { IWriteDocumentTypeRepository } from '@src/modules/manage/domain/ports/output/document-type-repository.interface';
import { EntityManager } from 'typeorm';
import { DocumentTypeDataAccessMapper } from '../../mappers/document-type.mapper';
import { DocumentTypeOrmEntity } from '@src/common/infrastructure/database/typeorm/document-type.orm';
import { DocumentTypeId } from '@src/modules/manage/domain/value-objects/document-type-id.vo';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';

@Injectable()
export class WriteDocumentTypeRepository
  implements IWriteDocumentTypeRepository
{
  constructor(
    private readonly _dataAccessMapper: DocumentTypeDataAccessMapper,
  ) {}

  async create(
    entity: DocumentTypeEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<DocumentTypeEntity>> {
    return this._dataAccessMapper.toEntity(
      await manager.save(
        this._dataAccessMapper.toOrmEntity(entity, OrmEntityMethod.CREATE),
      ),
    );
  }

  async update(
    entity: DocumentTypeEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<DocumentTypeEntity>> {
    const OrmEntity = this._dataAccessMapper.toOrmEntity(
      entity,
      OrmEntityMethod.UPDATE,
    );

    try {
      await manager.update(
        DocumentTypeOrmEntity,
        entity.getId().value,
        OrmEntity,
      );

      return this._dataAccessMapper.toEntity(OrmEntity);
    } catch (error) {
      throw error;
    }
  }

  async delete(id: DocumentTypeId, manager: EntityManager): Promise<void> {
    try {
      await manager.softDelete(DocumentTypeOrmEntity, id.value);
    } catch (error) {
      throw error;
    }
  }
}
