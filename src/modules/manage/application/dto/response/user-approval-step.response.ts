import { ApiProperty } from '@nestjs/swagger';
import { DocumentStatusResponse } from './document-status.response';
import { UserResponse } from './user.response';
import { ApprovalWorkflowStepResponse } from './approval-workflow-step.response';

export class UserApprovalStepResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  user_approval_id: number;

  @ApiProperty()
  approval_workflow_step_id: number;

  @ApiProperty()
  approver_id: number;

  @ApiProperty()
  approved_at: string | null;

  @ApiProperty()
  status_id: number;

  @ApiProperty()
  remark: string;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;

  @ApiProperty()
  deleted_at: string | null;

  @ApiProperty()
  document_status: DocumentStatusResponse | null;

  @ApiProperty()
  user: UserResponse | null;

  @ApiProperty()
  approval_workflow_step: ApprovalWorkflowStepResponse | null;
}
