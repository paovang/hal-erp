import { OmitType } from '@nestjs/swagger';
import { CreateApprovalWorkflowDto } from './create.dto';

export class UpdateApprovalWorkflowDto extends OmitType(
  CreateApprovalWorkflowDto,
  ['steps'],
) {}
