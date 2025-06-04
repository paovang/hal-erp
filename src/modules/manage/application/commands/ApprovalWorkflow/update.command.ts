import { EntityManager } from 'typeorm';
import { UpdateApprovalWorkflowDto } from '../../dto/create/ApprovalWorkflow/update.dto';

export class UpdateCommand {
  constructor(
    public readonly id: number,
    public readonly dto: UpdateApprovalWorkflowDto,
    public readonly manager: EntityManager,
  ) {}
}
