import { DocumentTypeEntity } from '@src/modules/manage/domain/entities/document-type.entity';
import { DocumentTypeOrmEntity } from '@src/common/infrastructure/database/typeorm/document-type.orm';
import { DocumentTypeId } from '../../domain/value-objects/document-type-id.vo';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import moment from 'moment-timezone';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';

export class DocumentTypeDataAccessMapper {
  toOrmEntity(
    documentTypeEntity: DocumentTypeEntity,
    method: OrmEntityMethod,
  ): DocumentTypeOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);
    const id = documentTypeEntity.getId();

    const mediaOrmEntity = new DocumentTypeOrmEntity();
    if (id) {
      mediaOrmEntity.id = id.value;
    }
    mediaOrmEntity.code = documentTypeEntity.code;
    mediaOrmEntity.name = documentTypeEntity.name;

    if (method === OrmEntityMethod.CREATE) {
      mediaOrmEntity.created_at = documentTypeEntity.createdAt ?? new Date(now);
    }

    mediaOrmEntity.updated_at = new Date(now);

    return mediaOrmEntity;
  }

  toEntity(ormData: DocumentTypeOrmEntity): DocumentTypeEntity {
    return DocumentTypeEntity.builder()
      .setDocumentTypeId(new DocumentTypeId(ormData.id))
      .setCode(ormData.code)
      .setName(ormData.name)
      .setCreatedAt(ormData.created_at)
      .setUpdatedAt(ormData.updated_at)
      .build();
  }
}
