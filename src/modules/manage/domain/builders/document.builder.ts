import { EnumDocumentStatus } from '../../application/constants/status-key.const';
import { DepartmentEntity } from '../entities/department.entity';
import { DocumentTypeEntity } from '../entities/document-type.entity';
import { DocumentEntity } from '../entities/document.entity';
import { PositionEntity } from '../entities/position.entity';
import { UserEntity } from '../entities/user.entity';
import { DocumentId } from '../value-objects/document-id.vo';

export class DocumentBuilder {
  documentId: DocumentId;
  document_number: string;
  title: string;
  description: string;
  total_amount: number;
  department_id: number;
  requester_id: number;
  document_type_id: number;
  status: EnumDocumentStatus;
  createdAt!: Date;
  updatedAt!: Date | null;
  deletedAt!: Date | null;
  department: DepartmentEntity;
  requester: UserEntity;
  position: PositionEntity[];
  documentType: DocumentTypeEntity;

  setDocumentId(value: DocumentId): this {
    this.documentId = value;
    return this;
  }

  setDocumentNumber(document_number: string): this {
    this.document_number = document_number;
    return this;
  }

  setTitle(title: string): this {
    this.title = title;
    return this;
  }

  setDescription(description: string): this {
    this.description = description;
    return this;
  }

  setStatus(status: EnumDocumentStatus): this {
    this.status = status;
    return this;
  }

  setTotalAmount(total_amount: number): this {
    this.total_amount = total_amount;
    return this;
  }

  setDepartmentId(department_id: number): this {
    this.department_id = department_id;
    return this;
  }

  setRequesterId(requester_id: number): this {
    this.requester_id = requester_id;
    return this;
  }

  setPosition(position: PositionEntity[]): this {
    this.position = position;
    return this;
  }

  setDocumentTypeId(document_type_id: number): this {
    this.document_type_id = document_type_id;
    return this;
  }

  setCreatedAt(createdAt: Date): this {
    this.createdAt = createdAt;
    return this;
  }

  setUpdatedAt(updatedAt: Date | null): this {
    this.updatedAt = updatedAt;
    return this;
  }

  setDeletedAt(deletedAt: Date | null): this {
    this.deletedAt = deletedAt;
    return this;
  }

  setDepartment(department: DepartmentEntity): this {
    this.department = department;
    return this;
  }

  setDocumentType(documentType: DocumentTypeEntity): this {
    this.documentType = documentType;
    return this;
  }

  setRequester(requester: UserEntity): this {
    this.requester = requester;
    return this;
  }

  build(): DocumentEntity {
    return DocumentEntity.create(this);
  }
}
