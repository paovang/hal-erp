import { Entity } from '@src/common/domain/entities/entity';
import { DocumentTypeId } from '../value-objects/document-type-id.vo';
import { DocumentCategoryBuilder } from '../builders/document-category.builder';
import { DocumentCategoryCode } from '@src/common/infrastructure/database/typeorm/document-category.orm';

export class DocumentCategoryEntity extends Entity<DocumentTypeId> {
  private readonly _code: DocumentCategoryCode;
  private readonly _name: string;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date | null;
  private readonly _deletedAt: Date | null;

  private constructor(builder: DocumentCategoryBuilder) {
    super();
    this.setId(builder.documentCategoryId);
    this._code = builder.code;
    this._name = builder.name;
    this._createdAt = builder.createdAt;
    this._updatedAt = builder.updatedAt ?? null;
    this._deletedAt = builder.deletedAt ?? null;
  }

  get code(): DocumentCategoryCode {
    return this._code;
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

  public static builder(): DocumentCategoryBuilder {
    return new DocumentCategoryBuilder();
  }

  static create(builder: DocumentCategoryBuilder): DocumentCategoryEntity {
    return new DocumentCategoryEntity(builder);
  }

  static getEntityName() {
    return 'document_category';
  }

  async validateExistingIdForUpdate() {
    if (!this.getId()) {
      console.log('phoudvang');
      // throw new UserDomainException(
      //   'users.user_is_not_in_correct_state_for_initialization',
      // );
    }
  }

  async initializeUpdateSetId(documentTypeId: DocumentTypeId) {
    this.setId(documentTypeId);
  }
}
