import { ApiProperty } from '@nestjs/swagger';
import { DocumentStatusResponse } from './document-status.response';
import { UserResponse } from './user.response';
import { ApprovalWorkflowStepResponse } from './approval-workflow-step.response';
import { PositionResponse } from './position.response';
import { DocumentApproverResponse } from './document-approver.response';

export class UserApprovalStepResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  user_approval_id: number;

  @ApiProperty()
  step_number: number;

  @ApiProperty()
  approver_id: number;

  @ApiProperty()
  approved_at: string | null;

  @ApiProperty()
  status_id: number;

  @ApiProperty()
  remark: string;

  @ApiProperty()
  requires_file_upload: boolean;

  @ApiProperty()
  is_otp: boolean;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;

  @ApiProperty()
  deleted_at: string | null;

  @ApiProperty()
  document_status: DocumentStatusResponse | null;

  @ApiProperty()
  approver: UserResponse | null;

  @ApiProperty()
  position: PositionResponse | null;

  @ApiProperty()
  approval_workflow_step: ApprovalWorkflowStepResponse | null;

  @ApiProperty()
  doc_approver: DocumentApproverResponse[] | null;
}
