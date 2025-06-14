import { EntityManager } from 'typeorm';
import { UpdateApprovalWorkflowDto } from '../../dto/create/approvalWorkflow/update.dto';
export class UpdateCommand {
  constructor(
    public readonly id: number,
    public readonly dto: UpdateApprovalWorkflowDto,
    public readonly manager: EntityManager,
  ) {}
}
