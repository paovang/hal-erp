import { Injectable } from '@nestjs/common';
import { DocumentEntity } from '../../domain/entities/document.entity';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { DocumentOrmEntity } from '@src/common/infrastructure/database/typeorm/document.orm';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import moment from 'moment-timezone';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { DocumentId } from '../../domain/value-objects/document-id.vo';
import { DepartmentDataAccessMapper } from './department.mapper';
import { UserDataAccessMapper } from './user.mapper';
import { DocumentTypeDataAccessMapper } from './document-type.mapper';
import { PositionDataAccessMapper } from './position.mapper';

@Injectable()
export class DocumentDataAccessMapper {
  constructor(
    private readonly departmentMapper: DepartmentDataAccessMapper,
    private readonly requesterMapper: UserDataAccessMapper,
    private readonly positionMapper: PositionDataAccessMapper,
    private readonly documentType: DocumentTypeDataAccessMapper,
  ) {}
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
    mediaOrmEntity.document_type_id = documentTypeEntity.document_type_id;
    mediaOrmEntity.requester_id = documentTypeEntity.requester_id;
    if (method === OrmEntityMethod.CREATE) {
      mediaOrmEntity.created_at = documentTypeEntity.createdAt ?? new Date(now);
    }
    mediaOrmEntity.updated_at = new Date(now);

    return mediaOrmEntity;
  }

  toEntity(ormData: DocumentOrmEntity): DocumentEntity {
    const builder = DocumentEntity.builder()
      .setDocumentId(new DocumentId(ormData.id))
      .setDocumentNumber(ormData.document_number)
      .setTitle(ormData.title ?? '')
      .setDescription(ormData.description ?? '')
      .setTotalAmount(ormData.total_amount ?? 0)
      .setDepartmentId(ormData.department_id ?? 0)
      .setRequesterId(ormData.requester_id ?? 0)
      .setDocumentTypeId(ormData.document_type_id ?? 0)
      .setCreatedAt(ormData.created_at)
      .setUpdatedAt(ormData.updated_at);

    if (ormData.departments) {
      builder.setDepartment(
        this.departmentMapper.toEntity(ormData.departments),
      );
    }
    if (ormData.document_types) {
      builder.setDocumentType(
        this.documentType.toEntity(ormData.document_types),
      );
    }
    if (ormData.users) {
      builder.setRequester(this.requesterMapper.toEntity(ormData.users));
    }

    const positions = ormData.users?.department_users?.map(
      (departmentUser) => departmentUser.positions,
    );
    if (positions) {
      const positionEntities = positions.map((position) =>
        this.positionMapper.toEntity(position),
      );
      builder.setPosition(positionEntities);
    }

    return builder.build();
  }
}
