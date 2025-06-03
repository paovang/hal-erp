import { EntityManager } from 'typeorm';
import { ApprovalWorkflowQueryDto } from '../../dto/query/approval-workflow.dto';

export class GetAllQuery {
  constructor(
    public readonly dto: ApprovalWorkflowQueryDto,
    public readonly manager: EntityManager,
  ) {}
}
