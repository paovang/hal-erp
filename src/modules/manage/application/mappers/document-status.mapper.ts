import { Injectable } from '@nestjs/common';
import { DocumentStatusResponse } from '../dto/response/document-status.response';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { DocumentStatusEntity } from '../../domain/entities/document-status.entity';

@Injectable()
export class DocumentStatusDataMapper {
  /** Mapper Entity To Response */
  toResponse(entity: DocumentStatusEntity): DocumentStatusResponse {
    const response = new DocumentStatusResponse();
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
