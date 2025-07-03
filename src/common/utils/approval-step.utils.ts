import { HttpStatus } from '@nestjs/common';
import { UserApprovalStepOrmEntity } from '@src/common/infrastructure/database/typeorm/user-approval-step.orm';
import { ApprovalWorkflowStepOrmEntity } from '@src/common/infrastructure/database/typeorm/approval-workflow-step.orm';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';

export const validatePreviousApprovalSteps = (
  workflowSteps: ApprovalWorkflowStepOrmEntity[],
  userApprovalSteps: UserApprovalStepOrmEntity[],
  currentStepId: number,
  approvedStatusId: number,
  cancelledStatusId: number,
): UserApprovalStepOrmEntity | undefined => {
  const currentStep = workflowSteps.find((step) => step.id === currentStepId);

  if (!currentStep?.step_number) {
    throw new ManageDomainException(
      'errors.invalid_current_step',
      HttpStatus.BAD_REQUEST,
    );
  }

  const userApprovalMap = new Map(
    userApprovalSteps.map((step) => [step.approval_workflow_step_id, step]),
  );

  for (const step of workflowSteps) {
    if (step.step_number! < currentStep.step_number!) {
      const approval = userApprovalMap.get(step.id);

      if (!approval || approval.status_id !== approvedStatusId) {
        if (approval?.status_id === cancelledStatusId) {
          throw new ManageDomainException(
            'errors.previous_step_cancelled',
            HttpStatus.BAD_REQUEST,
          );
        }

        throw new ManageDomainException(
          'errors.previous_step_not_approved',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  return userApprovalMap.get(currentStepId);
};
