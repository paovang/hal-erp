import { Entity } from '@src/common/domain/entities/entity';
import { DocumentStatusId } from '../value-objects/document-status-id.vo';
import { DocumentStatusBuilder } from '../builders/document-status.builder';

export class DocumentStatusEntity extends Entity<DocumentStatusId> {
  private readonly _name: string;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date | null;
  private readonly _deletedAt: Date | null;

  private constructor(builder: DocumentStatusBuilder) {
    super();
    this.setId(builder.documentStatusId);
    this._name = builder.name;
    this._createdAt = builder.createdAt;
    this._updatedAt = builder.updatedAt ?? null;
    this._deletedAt = builder.deletedAt ?? null;
  }

  get name(): string {
    return this._name;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date | null {
    return this._updatedAt;
  }

  get deletedAt(): Date | null {
    return this._deletedAt;
  }

  public static builder(): DocumentStatusBuilder {
    return new DocumentStatusBuilder();
  }

  static create(builder: DocumentStatusBuilder): DocumentStatusEntity {
    return new DocumentStatusEntity(builder);
  }

  static getEntityName() {
    return 'document_status';
  }

  async validateExistingIdForUpdate() {
    if (!this.getId()) {
      console.log('phoudvang');
      // throw new UserDomainException(
      //   'users.user_is_not_in_correct_state_for_initialization',
      // );
    }
  }

  async initializeUpdateSetId(documentStatusId: DocumentStatusId) {
    this.setId(documentStatusId);
  }
}
