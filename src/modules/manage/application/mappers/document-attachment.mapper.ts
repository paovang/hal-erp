import { Injectable } from '@nestjs/common';
import { DocumentAttachmentEntity } from '../../domain/entities/document-attachment.entity';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { DocumentAttachmentResponse } from '../dto/response/document-attachment.response';
import { DocumentAttachmentInterface } from '../commands/userApprovalStep/interface/document-attachment.interface';
import { UserDataMapper } from './user.mapper';

@Injectable()
export class DocumentAttachmentDataMapper {
  constructor(private readonly createdByMapper: UserDataMapper) {}
  /** Mapper Dto To Entity */
  toEntity(dto: DocumentAttachmentInterface): DocumentAttachmentEntity {
    const builder = DocumentAttachmentEntity.builder();

    if (dto.document_id) {
      builder.setDocumentId(dto.document_id);
    }

    if (dto.file_name) {
      builder.setFileName(dto.file_name);
    }

    if (dto.created_by) {
      builder.setCreatedBy(dto.created_by);
    }

    return builder.build();
  }

  /** Mapper Entity To Response */
  toResponse(entity: DocumentAttachmentEntity): DocumentAttachmentResponse {
    const file = entity?.file_name
      ? `${process.env.AWS_CLOUDFRONT_DISTRIBUTION_DOMAIN_NAME}/${entity.file_name}`
      : '';
    const response = new DocumentAttachmentResponse();
    response.id = Number(entity.getId().value);
    response.document_id = Number(entity.document_id);
    response.file_name = entity.file_name;
    response.file_name_url = file;
    response.created_by = Number(entity.created_by);
    response.created_at = moment
      .tz(entity.createdAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    response.updated_at = moment
      .tz(entity.updatedAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);

    response.created_by_user = entity.createdByUser
      ? this.createdByMapper.toResponse(entity.createdByUser)
      : null;

    return response;
  }
}
