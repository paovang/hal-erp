import { Injectable } from '@nestjs/common';
import { EnumDocumentTransactionType } from '../constants/status-key.const';
import { DocumentTransactionEntity } from '../../domain/entities/document-transaction.entity';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { DocumentTransactionResponse } from '../dto/response/document-transaction.response';

export interface DocumentTransactionInterface {
  document_id: number;
  budget_item_detail_id: number;
  transaction_number: string;
  amount: number;
  transaction_type: EnumDocumentTransactionType;
}

@Injectable()
export class DocumentTransactionDataMapper {
  /** Mapper Dto To Entity */
  toEntity(dto: DocumentTransactionInterface): DocumentTransactionEntity {
    const builder = DocumentTransactionEntity.builder();

    if (dto.document_id) {
      builder.setDocumentId(dto.document_id);
    }

    if (dto.budget_item_detail_id) {
      builder.setBudgetItemDetailId(dto.budget_item_detail_id);
    }

    if (dto.transaction_number) {
      builder.setTransactionNumber(dto.transaction_number);
    }

    if (dto.amount) {
      builder.setAmount(dto.amount);
    }

    if (dto.transaction_type) {
      builder.setTransactionType(dto.transaction_type);
    }

    return builder.build();
  }

  /** Mapper Entity To Response */
  toResponse(entity: DocumentTransactionEntity): DocumentTransactionResponse {
    const response = new DocumentTransactionResponse();
    response.id = entity.getId().value;
    response.document_id = entity.document_id;
    response.budget_item_detail_id = entity.budget_item_detail_id;
    response.transaction_number = entity.transaction_number;
    response.amount = entity.amount;
    response.transaction_type = entity.transaction_type;
    response.created_at = moment
      .tz(entity.createdAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    response.updated_at = moment
      .tz(entity.updatedAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);

    return response;
  }
}
