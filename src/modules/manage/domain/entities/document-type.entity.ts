import { Entity } from '@src/common/domain/entities/entity';
import { DepartmentId } from '@src/modules/manage/domain/value-objects/department-id.vo';
import { DocumentTypeId } from '../value-objects/document-type-id.vo';
import { DocumentTypeBuilder } from '../builders/document-type.builder';

export class DocumentTypeEntity extends Entity<DocumentTypeId> {
  private readonly _code: string;
  private readonly _name: string;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date | null;
  private readonly _deletedAt: Date | null;

  private constructor(builder: DocumentTypeBuilder) {
    super();
    this.setId(builder.documentTypeId);
    this._code = builder.code;
    this._name = builder.name;
    this._createdAt = builder.createdAt;
    this._updatedAt = builder.updatedAt ?? null;
    this._deletedAt = builder.deletedAt ?? null;
  }

  get code(): string {
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

  public static builder(): DocumentTypeBuilder {
    return new DocumentTypeBuilder();
  }

  static create(builder: DocumentTypeBuilder): DocumentTypeEntity {
    return new DocumentTypeEntity(builder);
  }

  static getEntityName() {
    return 'document_type';
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
