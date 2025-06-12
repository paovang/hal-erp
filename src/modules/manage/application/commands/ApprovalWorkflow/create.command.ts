import { EntityManager } from 'typeorm';
import { CreateApprovalWorkflowDto } from '../../dto/create/approvalWorkflow/create.dto';

export class CreateCommand {
  constructor(
    public readonly dto: CreateApprovalWorkflowDto,
    public readonly manager: EntityManager,
  ) {}
}
