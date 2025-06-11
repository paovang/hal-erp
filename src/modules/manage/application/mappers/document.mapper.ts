import { Injectable } from '@nestjs/common';
import { CreateDocumentDto } from '../dto/create/Document/create.dto';
import { DocumentEntity } from '../../domain/entities/document.entity';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { DocumentResponse } from '../dto/response/document.response';

@Injectable()
export class DocumentDataMapper {
  /** Mapper Dto To Entity */
  toEntity(dto: CreateDocumentDto, generateCode: string): DocumentEntity {
    const builder = DocumentEntity.builder();

    if (dto.title) {
      builder.setTitle(dto.title);
    }

    if (generateCode) {
      builder.setDocumentNumber(generateCode);
    }

    if (dto.description) {
      builder.setDescription(dto.description);
    }

    if (dto.total_amount) {
      builder.setTotalAmount(dto.total_amount);
    }

    if (dto.requesterId) {
      builder.setRequesterId(dto.requesterId);
    }

    if (dto.departmentId) {
      builder.setDepartmentId(dto.departmentId);
    }

    return builder.build();
  }

  /** Mapper Entity To Response */
  toResponse(entity: DocumentEntity): DocumentResponse {
    const response = new DocumentResponse();
    response.id = entity.getId().value;
    response.document_number = entity.document_number;
    response.title = entity.title;
    response.description = entity.description;
    response.total_amount = entity.total_amount;
    response.department_id = entity.department_id;
    response.requester_id = entity.requester_id;
    response.created_at = moment
      .tz(entity.createdAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    response.updated_at = moment
      .tz(entity.updatedAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);

    return response;
  }
}
