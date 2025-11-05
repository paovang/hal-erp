import { StatusEnum } from '@src/common/enums/status.enum';
import { ApprovalWorkflowStepEntity } from '../entities/approval-workflow-step.entity';
import { ApprovalWorkflowEntity } from '../entities/approval-workflow.entity';
import { DocumentTypeEntity } from '../entities/document-type.entity';
import { ApprovalWorkflowId } from '../value-objects/approval-workflow-id.vo';
import { CompanyEntity } from '../entities/company.entity';

export class ApprovalWorkflowBuilder {
  approvalWorkflowId: ApprovalWorkflowId;
  documentTypeId: number;
  name: string;
  company_id: number;
  createdAt!: Date;
  updatedAt!: Date | null;
  deletedAt!: Date | null;
  document_type: DocumentTypeEntity;
  steps: ApprovalWorkflowStepEntity[] | null;
  status: StatusEnum;
  company: CompanyEntity | null;

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

  setStatus(status: StatusEnum): this {
    this.status = status;
    return this;
  }

  setCompanyId(company_id: number): this {
    this.company_id = company_id;
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

  setCompany(company: CompanyEntity | null): this {
    this.company = company;
    return this;
  }

  setSteps(steps: ApprovalWorkflowStepEntity[] | null): this {
    this.steps = steps;
    return this;
  }

  build(): ApprovalWorkflowEntity {
    return ApprovalWorkflowEntity.create(this);
  }
}
