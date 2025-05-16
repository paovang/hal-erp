import { Injectable } from '@nestjs/common';
import { DepartmentEntity } from '@src/modules/manage/domain/entities/department.entity';
import { DepartmentResponse } from '@src/modules/manage/application/dto/response/department.response';
import moment from 'moment-timezone';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { CreateDepartmentDto } from '@src/modules/manage/application/dto/create/department/create.dto';
import { UpdateDepartmentDto } from '@src/modules/manage/application/dto/create/department/update.dto';
import { CreateDocumentTypeDto } from '../dto/create/documentType/create.dto';
import { DocumentTypeEntity } from '../../domain/entities/document-type.entity';
import { DocumentTypeResponse } from '../dto/response/document-type.response';

@Injectable()
export class DocumentTypeDataMapper {
  /** Mapper Dto To Entity */
  toEntity(dto: CreateDocumentTypeDto, generateCode: string): DocumentTypeEntity {
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
