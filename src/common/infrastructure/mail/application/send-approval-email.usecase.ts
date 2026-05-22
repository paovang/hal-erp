import { HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';

export interface ApprovalWorkflowStepInput {
  id: number;
  step_name: string;
  step_number: number;
  type: string;
  department: { code: string; name: string } | null;
  user: { username: string; email: string; tel: string } | null;
}

export interface SendApprovalEmailInput {
  to: string;
  approverName: string;
  workflowDisplayName: string;
  token: string;
  workflowId: number;
  steps: ApprovalWorkflowStepInput[];
}

@Injectable()
export class SendApprovalEmailUseCase {
  async execute(input: SendApprovalEmailInput): Promise<void> {
    const apiUrl = process.env.APPROVAL_API_URL;
    const secret = process.env.APPROVAL_SECRET_KEY;
    if (!apiUrl || !secret) {
      throw new ManageDomainException(
        'errors.not_found',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { property: 'APPROVAL_API_URL/APPROVAL_SECRET_KEY' },
      );
    }

    try {
      await axios.post(`${apiUrl}/send-workflow-approval-mail`, input, {
        headers: {
          'Content-Type': 'application/json',
          'x-secret-key': secret,
        },
      });
    } catch (error: any) {
      throw new ManageDomainException(
        'errors.send_otp',
        HttpStatus.BAD_REQUEST,
        { property: error.response?.data?.message ?? 'send mail failed' },
      );
    }
  }
}
