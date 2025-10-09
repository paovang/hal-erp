import { Entity } from '@src/common/domain/entities/entity';
import { DocumentAttachmentId } from '../value-objects/document-attachment-id.vo';
import { DocumentAttachmentBuilder } from '../builders/document-attachment.builder';
import { UserEntity } from './user.entity';

export class DocumentAttachmentEntity extends Entity<DocumentAttachmentId> {
  private readonly _document_id: number;
  private readonly _file_name: string;
  private readonly _created_by: number;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date | null;
  private readonly _deletedAt: Date | null;
  private readonly _createdByUser: UserEntity | null;

  private constructor(builder: DocumentAttachmentBuilder) {
    super();
    this.setId(builder.documentAttachmentId);
    this._document_id = builder.document_id;
    this._file_name = builder.file_name;
    this._created_by = builder.created_by;
    this._createdAt = builder.createdAt;
    this._updatedAt = builder.updatedAt ?? null;
    this._deletedAt = builder.deletedAt ?? null;
    this._createdByUser = builder.created_by_user ?? null;
  }

  get document_id(): number {
    return this._document_id;
  }

  get file_name(): string {
    return this._file_name;
  }

  get created_by(): number {
    return this._created_by;
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

  get createdByUser(): UserEntity | null {
    return this._createdByUser;
  }

  public static builder(): DocumentAttachmentBuilder {
    return new DocumentAttachmentBuilder();
  }

  static create(builder: DocumentAttachmentBuilder): DocumentAttachmentEntity {
    return new DocumentAttachmentEntity(builder);
  }

  static getEntityName() {
    return 'DocumentAttachment';
  }

  async validateExistingIdForUpdate() {
    if (!this.getId()) {
      console.log('paovang');
      // throw new UserDomainException(
      //   'users.user_is_not_in_correct_state_for_initialization',
      // );
    }
  }

  async initializeUpdateSetId(documentAttachmentId: DocumentAttachmentId) {
    this.setId(documentAttachmentId);
  }
}
