import { ApprovalWorkflowEntity } from '../entities/approval-workflow.entity';
import { DocumentTypeEntity } from '../entities/document-type.entity';
import { ApprovalWorkflowId } from '../value-objects/approval-workflow-id.vo';

export class ApprovalWorkflowBuilder {
  approvalWorkflowId: ApprovalWorkflowId;
  documentTypeId: number;
  name: string;
  createdAt!: Date;
  updatedAt!: Date | null;
  deletedAt!: Date | null;
  document_type: DocumentTypeEntity;

  setApprovalWorkflowId(value: ApprovalWorkflowId): this {
    this.approvalWorkflowId = value;
    return this;
  }

  setDocumentTypeId(documentTypeId: number): this {
    this.documentTypeId = documentTypeId;
    return this;
  }

  setName(name: string): this {
    this.name = name;
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

  setDocumentType(documentType: DocumentTypeEntity): this {
    this.document_type = documentType;
    return this;
  }

  build(): ApprovalWorkflowEntity {
    return ApprovalWorkflowEntity.create(this);
  }
}
