import { Injectable } from '@nestjs/common';
import moment from 'moment-timezone';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { CreateDocumentTypeDto } from '../dto/create/documentType/create.dto';
import { DocumentTypeEntity } from '../../domain/entities/document-type.entity';
import { DocumentTypeResponse } from '../dto/response/document-type.response';
import { UpdateDocumentTypeDto } from '../dto/create/documentType/update.dto';

@Injectable()
export class DocumentTypeDataMapper {
  /** Mapper Dto To Entity */
  toEntity(
    dto: CreateDocumentTypeDto | UpdateDocumentTypeDto,
    generateCode: string,
  ): DocumentTypeEntity {
    const builder = DocumentTypeEntity.builder();

    if (dto.name) {
      builder.setName(dto.name);
    }

    if (generateCode) {
      builder.setCode(generateCode);
    }

    return builder.build();
  }

  /** Mapper Entity To Response */
  toResponse(entity: DocumentTypeEntity): DocumentTypeResponse {
    const response = new DocumentTypeResponse();
    response.id = entity.getId().value;
    response.code = entity.code;
    response.name = entity.name;
    response.created_at = moment
      .tz(entity.createdAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    response.updated_at = moment
      .tz(entity.updatedAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);

    return response;
  }
}
