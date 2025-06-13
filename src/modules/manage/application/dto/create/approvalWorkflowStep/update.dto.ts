import { PartialType } from '@nestjs/swagger';
import { CreateApprovalWorkflowStepDto } from './create.dto';

export class UpdateApprovalWorkflowStepDto extends PartialType(
  CreateApprovalWorkflowStepDto,
) {}
