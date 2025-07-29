import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { DocumentTransactionEntity } from '../../domain/entities/document-transaction.entity';
import { DocumentTransactionOrmEntity } from '@src/common/infrastructure/database/typeorm/document-transaction.orm';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import moment from 'moment-timezone';
import { DocumentTransactionId } from '../../domain/value-objects/document-transaction-id.vo';
import { EnumDocumentTransactionType } from '../../application/constants/status-key.const';

export class DocumentTransactionDataAccessMapper {
  toOrmEntity(
    documentTransactionEntity: DocumentTransactionEntity,
    method: OrmEntityMethod,
  ): DocumentTransactionOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);
    const id = documentTransactionEntity.getId();

    const mediaOrmEntity = new DocumentTransactionOrmEntity();
    if (id) {
      mediaOrmEntity.id = id.value;
    }
    mediaOrmEntity.transaction_number =
      documentTransactionEntity.transaction_number;
    mediaOrmEntity.document_id = documentTransactionEntity.document_id;
    mediaOrmEntity.budget_item_detail_id =
      documentTransactionEntity.budget_item_detail_id;
    mediaOrmEntity.amount = documentTransactionEntity.amount;
    mediaOrmEntity.transaction_type =
      documentTransactionEntity.transaction_type;

    if (method === OrmEntityMethod.CREATE) {
      mediaOrmEntity.created_at =
        documentTransactionEntity.createdAt ?? new Date(now);
    }

    mediaOrmEntity.updated_at = new Date(now);

    return mediaOrmEntity;
  }

  toEntity(ormData: DocumentTransactionOrmEntity): DocumentTransactionEntity {
    return DocumentTransactionEntity.builder()
      .setDocumentTransactionId(new DocumentTransactionId(ormData.id))
      .setTransactionNumber(ormData.transaction_number ?? '')
      .setDocumentId(ormData.document_id ?? 0)
      .setBudgetItemDetailId(ormData.budget_item_detail_id ?? 0)
      .setAmount(ormData.amount ?? 0)
      .setTransactionType(
        ormData.transaction_type ?? EnumDocumentTransactionType.COMMIT,
      )
      .setCreatedAt(ormData.created_at)
      .setUpdatedAt(ormData.updated_at)
      .build();
  }
}
