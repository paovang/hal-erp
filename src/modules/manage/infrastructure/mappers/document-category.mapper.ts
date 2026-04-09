import { DocumentTypeId } from '../../domain/value-objects/document-type-id.vo';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import moment from 'moment-timezone';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { DocumentCategoryEntity } from '../../domain/entities/document-category.entity';
import { DocumentCategoryOrmEntity } from '@src/common/infrastructure/database/typeorm/document-category.orm';
import { DocumentCategoryId } from '../../domain/value-objects/document-category-id.vo';
import { Injectable } from '@nestjs/common';
@Injectable()
export class DocumentCategoryDataAccessMapper {
  toOrmEntity(
    documentCategoryEntity: DocumentCategoryEntity,
    method: OrmEntityMethod,
  ): DocumentCategoryOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);
    const id = documentCategoryEntity.getId();

    const mediaOrmEntity = new DocumentCategoryOrmEntity();
    if (id) {
      mediaOrmEntity.id = id.value;
    }
    mediaOrmEntity.code = documentCategoryEntity.code;
    mediaOrmEntity.name = documentCategoryEntity.name;

    return mediaOrmEntity;
  }

  toEntity(ormData: DocumentCategoryOrmEntity): DocumentCategoryEntity {
    const builder = DocumentCategoryEntity.builder()
      .setDocumentCategoryId(new DocumentCategoryId(ormData.id))
      .setCode(ormData.code)
      .setName(ormData.name)
      .setCreatedAt(ormData.created_at)
      .setUpdatedAt(ormData.updated_at)
      .setDeletedAt(ormData.deleted_at);
    // .setCategoryId(ormData.document_category_id)
    // .setCategoryId(ormData.document_category_id)

    return builder.build();
  }
}

export class TestFuc {
  toHi() {
    return 'hi';
  }
}
