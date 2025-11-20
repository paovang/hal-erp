import { Entity } from '@src/common/domain/entities/entity';
import { DocumentId } from '../value-objects/document-id.vo';
import { DocumentBuilder } from '../builders/document.builder';
import { DepartmentEntity } from './department.entity';
import { UserEntity } from './user.entity';
import { DocumentTypeEntity } from './document-type.entity';
import { PositionEntity } from './position.entity';
import { EnumDocumentStatus } from '../../application/constants/status-key.const';
import { CompanyEntity } from './company.entity';

export class DocumentEntity extends Entity<DocumentId> {
  private readonly _document_number: string;
  private readonly _title: string;
  private readonly _description: string;
  private readonly _total_amount: number;
  private readonly _department_id: number;
  private readonly _requester_id: number;
  private readonly _document_type_id: number;
  private readonly _company_id: number;
  private readonly _status: EnumDocumentStatus;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date | null;
  private readonly _deletedAt: Date | null;
  private readonly _department: DepartmentEntity | null;
  private readonly _requester: UserEntity | null;
  private readonly _position: PositionEntity[] | null;
  private readonly _documentType: DocumentTypeEntity | null;
  private readonly _company: CompanyEntity | null;

  private constructor(builder: DocumentBuilder) {
    super();
    this.setId(builder.documentId);
    this._document_number = builder.document_number;
    this._title = builder.title;
    this._description = builder.description;
    this._total_amount = builder.total_amount;
    this._department_id = builder.department_id;
    this._requester_id = builder.requester_id;
    this._document_type_id = builder.document_type_id;
    this._company_id = builder.company_id;
    this._createdAt = builder.createdAt;
    this._updatedAt = builder.updatedAt ?? null;
    this._deletedAt = builder.deletedAt ?? null;
    this._department = builder.department ?? null;
    this._requester = builder.requester ?? null;
    this._position = builder.position ?? null;
    this._documentType = builder.documentType ?? null;
    this._status = builder.status;
    this._company = builder.company ?? null;
  }

  get document_number(): string {
    return this._document_number;
  }

  get title(): string {
    return this._title;
  }

  get description(): string {
    return this._description;
  }

  get total_amount(): number {
    return this._total_amount;
  }

  get department_id(): number {
    return this._department_id;
  }

  get company_id(): number {
    return this._company_id;
  }

  get requester_id(): number {
    return this._requester_id;
  }

  get status(): EnumDocumentStatus {
    return this._status;
  }

  get position(): PositionEntity[] | null {
    return this._position;
  }

  get document_type_id(): number {
    return this._document_type_id;
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

  get department(): DepartmentEntity | null {
    return this._department;
  }

  get documentType(): DocumentTypeEntity | null {
    return this._documentType;
  }

  get requester(): UserEntity | null {
    return this._requester;
  }

  get company(): CompanyEntity | null {
    return this._company;
  }

  public static builder(): DocumentBuilder {
    return new DocumentBuilder();
  }

  static create(builder: DocumentBuilder): DocumentEntity {
    return new DocumentEntity(builder);
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

  async initializeUpdateSetId(documentId: DocumentId) {
    this.setId(documentId);
  }
}
