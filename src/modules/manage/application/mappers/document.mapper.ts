import { Injectable } from '@nestjs/common';
import { DocumentEntity } from '../../domain/entities/document.entity';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { DocumentResponse } from '../dto/response/document.response';
import { UserDataMapper } from './user.mapper';
import { DepartmentDataMapper } from './department.mapper';
import { DocumentTypeDataMapper } from './document-type.mapper';
import { DocumentEntityMode } from '@src/common/utils/orm-entity-method.enum';
import { CreateDocumentDto } from '../dto/create/document/create.dto';
import { UpdateDocumentDto } from '../dto/create/document/update.dto';

@Injectable()
export class DocumentDataMapper {
  constructor(
    private readonly departmentDataMapper: DepartmentDataMapper,
    private readonly requesterDataMapper: UserDataMapper,
    private readonly documentTypeDataMapper: DocumentTypeDataMapper,
  ) {}
  /** Mapper Dto To Entity */
  toEntity(
    dto: CreateDocumentDto | UpdateDocumentDto,
    mode: DocumentEntityMode,
    generateCode?: string,
    user_id?: number,
  ): DocumentEntity {
    const builder = DocumentEntity.builder();

    if (dto.title) {
      builder.setTitle(dto.title);
    }

    if (mode === DocumentEntityMode.CREATE) {
      builder.setDocumentNumber(generateCode as string);
    }

    if (dto.description) {
      builder.setDescription(dto.description);
    }

    if (dto.total_amount) {
      builder.setTotalAmount(dto.total_amount);
    }

    if (user_id) {
      builder.setRequesterId(user_id);
    }

    if (dto.departmentId) {
      builder.setDepartmentId(dto.departmentId);
    }

    if (dto.documentTypeId) {
      builder.setDocumentTypeId(dto.documentTypeId);
    }

    return builder.build();
  }

  /** Mapper Entity To Response */
  toResponse(entity: DocumentEntity): DocumentResponse {
    const response = new DocumentResponse();
    response.id = Number(entity.getId().value);
    response.document_number = entity.document_number;
    response.title = entity.title;
    response.description = entity.description;
    response.total_amount = entity.total_amount;
    response.department_id = Number(entity.department_id);
    response.requester_id = entity.requester_id;
    response.document_type_id = entity.document_type_id;
    response.created_at = moment
      .tz(entity.createdAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    response.updated_at = moment
      .tz(entity.updatedAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);

    response.department = entity.department
      ? this.departmentDataMapper.toResponse(entity.department)
      : null;

    response.document_type = entity.documentType
      ? this.documentTypeDataMapper.toResponse(entity.documentType)
      : null;

    response.requester = entity.requester
      ? this.requesterDataMapper.toResponse(entity.requester)
      : null;

    return response;
  }
}
