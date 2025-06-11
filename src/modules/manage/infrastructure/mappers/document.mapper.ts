import { Injectable } from '@nestjs/common';
import { DocumentEntity } from '../../domain/entities/document.entity';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { DocumentOrmEntity } from '@src/common/infrastructure/database/typeorm/document.orm';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import moment from 'moment-timezone';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { DocumentId } from '../../domain/value-objects/document-id.vo';

@Injectable()
export class DocumentDataAccessMapper {
  toOrmEntity(
    documentTypeEntity: DocumentEntity,
    method: OrmEntityMethod,
  ): DocumentOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);
    const id = documentTypeEntity.getId();

    const mediaOrmEntity = new DocumentOrmEntity();
    if (id) {
      mediaOrmEntity.id = id.value;
    }

    mediaOrmEntity.document_number = documentTypeEntity.document_number;
    mediaOrmEntity.title = documentTypeEntity.title;
    mediaOrmEntity.description = documentTypeEntity.description;
    mediaOrmEntity.total_amount = documentTypeEntity.total_amount;
    mediaOrmEntity.department_id = documentTypeEntity.department_id;
    mediaOrmEntity.requester_id = documentTypeEntity.requester_id;
    if (method === OrmEntityMethod.CREATE) {
      mediaOrmEntity.created_at = documentTypeEntity.createdAt ?? new Date(now);
    }
    mediaOrmEntity.updated_at = new Date(now);

    return mediaOrmEntity;
  }

  toEntity(ormData: DocumentOrmEntity): DocumentEntity {
    return DocumentEntity.builder()
      .setDocumentId(new DocumentId(ormData.id))
      .setDocumentNumber(ormData.document_number)
      .setTitle(ormData.title ?? '')
      .setDescription(ormData.description ?? '')
      .setTotalAmount(ormData.total_amount ?? 0)
      .setDepartmentId(ormData.department_id ?? 0)
      .setRequesterId(ormData.requester_id ?? 0)
      .setCreatedAt(ormData.created_at)
      .setUpdatedAt(ormData.updated_at)
      .build();
  }
}
