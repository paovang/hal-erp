import { PartialType } from '@nestjs/swagger';
import { CreateApprovalWorkflowDto } from './create.dto';

export class UpdateApprovalWorkflowDto extends PartialType(
  CreateApprovalWorkflowDto,
) {}
