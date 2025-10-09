import { EntityManager } from 'typeorm';
import { CreateApprovalWorkflowStepDto } from '../../dto/create/approvalWorkflowStep/create.dto';

export class CreateCommand {
  constructor(
    public readonly id: number,
    public readonly dto: CreateApprovalWorkflowStepDto,
    public readonly manager: EntityManager,
  ) {}
}
