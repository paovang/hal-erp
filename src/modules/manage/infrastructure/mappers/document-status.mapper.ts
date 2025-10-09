import { DocumentStatusOrmEntity } from '@src/common/infrastructure/database/typeorm/document-statuse.orm';
import { DocumentStatusId } from '../../domain/value-objects/document-status-id.vo';
import { DocumentStatusEntity } from '../../domain/entities/document-status.entity';

export class DocumentStatusDataAccessMapper {
  toEntity(ormData: DocumentStatusOrmEntity): DocumentStatusEntity {
    return DocumentStatusEntity.builder()
      .setDocumentStatusId(new DocumentStatusId(ormData.id))
      .setName(ormData.name ?? '')
      .setCreatedAt(ormData.created_at)
      .setUpdatedAt(ormData.updated_at)
      .build();
  }
}
