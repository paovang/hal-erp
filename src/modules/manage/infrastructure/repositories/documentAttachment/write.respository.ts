import { Injectable } from '@nestjs/common';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { DocumentAttachmentEntity } from '@src/modules/manage/domain/entities/document-attachment.entity';
import { IWriteDocumentAttachmentRepository } from '@src/modules/manage/domain/ports/output/document-attachment.interface';
import { EntityManager } from 'typeorm';
import { DocumentAttachmentDataAccessMapper } from '../../mappers/document-attachment.mapper';
import { DocumentAttachmentOrmEntity } from '@src/common/infrastructure/database/typeorm/document-attachment.orm';

@Injectable()
export class WriteDocumentAttachmentRepository
  implements IWriteDocumentAttachmentRepository
{
  constructor(
    private readonly _dataAccessMapper: DocumentAttachmentDataAccessMapper,
  ) {}

  async create(
    entity: DocumentAttachmentEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<DocumentAttachmentEntity>> {
    return this._dataAccessMapper.toEntity(
      await manager.save(
        this._dataAccessMapper.toOrmEntity(entity, OrmEntityMethod.CREATE),
      ),
    );
  }

  async update(
    entity: DocumentAttachmentEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<DocumentAttachmentEntity>> {
    const ormEntity = this._dataAccessMapper.toOrmEntity(
      entity,
      OrmEntityMethod.UPDATE,
    );

    // Only the file is editable here — keep document_id / created_by untouched.
    await manager.update(DocumentAttachmentOrmEntity, entity.getId().value, {
      file_name: ormEntity.file_name as unknown as string,
      updated_at: ormEntity.updated_at,
    });

    return this._dataAccessMapper.toEntity(ormEntity);
  }
}
