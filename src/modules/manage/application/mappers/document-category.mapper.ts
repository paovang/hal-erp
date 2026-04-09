import { Injectable } from '@nestjs/common';
import moment from 'moment-timezone';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DocumentCategoryEntity } from '../../domain/entities/document-category.entity';
import { DocumentCategoryResponse } from '../dto/response/document-category.response';

@Injectable()
export class DocumentCategoryDataMapper {
  toResponse(entity: DocumentCategoryEntity): DocumentCategoryResponse {
    const response = new DocumentCategoryResponse();
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
