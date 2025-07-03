import { ApiProperty } from '@nestjs/swagger';
import { DocumentResponse } from './document.response';
import { UserApprovalStepResponse } from './user-approval-step.response';
import { DocumentStatusResponse } from './document-status.response';

export class UserApprovalResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  document_id: number;

  @ApiProperty()
  approval_workflow_id: number;

  @ApiProperty()
  status_id: number;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;

  @ApiProperty()
  deleted_at: string | null;

  @ApiProperty()
  document: DocumentResponse | null;

  @ApiProperty()
  document_status: DocumentStatusResponse | null;

  @ApiProperty()
  approval_step: UserApprovalStepResponse[];
}
