import { EntityManager } from 'typeorm';
import { UpdateApprovalWorkflowStepDto } from '../../dto/create/approvalWorkflowStep/update.dto';

export class UpdateCommand {
  constructor(
    public readonly id: number,
    public readonly dto: UpdateApprovalWorkflowStepDto,
    public readonly manager: EntityManager,
  ) {}
}
