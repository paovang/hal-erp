import { Injectable } from '@nestjs/common';
import { DocumentAttachmentEntity } from '../../domain/entities/document-attachment.entity';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { DocumentAttachmentOrmEntity } from '@src/common/infrastructure/database/typeorm/document-attachment.orm';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { DocumentAttachmentId } from '../../domain/value-objects/document-attachment-id.vo';
import { UserDataAccessMapper } from './user.mapper';

@Injectable()
export class DocumentAttachmentDataAccessMapper {
  constructor(private readonly createdByMapper: UserDataAccessMapper) {}
  toOrmEntity(
    documentTypeEntity: DocumentAttachmentEntity,
    method: OrmEntityMethod,
  ): DocumentAttachmentOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);
    const id = documentTypeEntity.getId();

    const mediaOrmEntity = new DocumentAttachmentOrmEntity();
    if (id) {
      mediaOrmEntity.id = id.value;
    }

    mediaOrmEntity.document_id = documentTypeEntity.document_id;
    mediaOrmEntity.file_name = documentTypeEntity.file_name;
    mediaOrmEntity.created_by = documentTypeEntity.created_by;
    if (method === OrmEntityMethod.CREATE) {
      mediaOrmEntity.created_at = documentTypeEntity.createdAt ?? new Date(now);
    }
    mediaOrmEntity.updated_at = new Date(now);

    return mediaOrmEntity;
  }

  toEntity(ormData: DocumentAttachmentOrmEntity): DocumentAttachmentEntity {
    const builder = DocumentAttachmentEntity.builder()
      .setDocumentAttachmentId(new DocumentAttachmentId(ormData.id))
      .setDocumentId(ormData.document_id ?? 0)
      .setFileName(ormData.file_name ?? '')
      .setCreatedBy(ormData.created_by ?? 0)
      .setCreatedAt(ormData.created_at ?? new Date())
      .setUpdatedAt(ormData.updated_at ?? new Date());

    if (ormData.users) {
      builder.setCreatedByUser(this.createdByMapper.toEntity(ormData.users));
    }

    return builder.build();
  }
}
