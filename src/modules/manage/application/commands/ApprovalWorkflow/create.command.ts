import { EntityManager } from 'typeorm';
import { CreateApprovalWorkflowDto } from '../../dto/create/ApprovalWorkflow/create.dto';
export class CreateCommand {
  constructor(
    public readonly dto: CreateApprovalWorkflowDto,
    public readonly manager: EntityManager,
  ) {}
}
