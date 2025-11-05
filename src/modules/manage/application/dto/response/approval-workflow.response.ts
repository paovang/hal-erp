import { ApiProperty } from '@nestjs/swagger';
import { DocumentTypeResponse } from './document-type.response';
import { ApprovalWorkflowStepResponse } from './approval-workflow-step.response';
import { StatusEnum } from '@src/common/enums/status.enum';
import { CompanyResponse } from './company.response';

export class ApprovalWorkflowResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  document_type_id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  company_id: number;

  @ApiProperty()
  status: StatusEnum;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;

  @ApiProperty()
  document_type: DocumentTypeResponse | null;

  @ApiProperty()
  company: CompanyResponse | null;

  @ApiProperty()
  steps: ApprovalWorkflowStepResponse[] | null;
}
