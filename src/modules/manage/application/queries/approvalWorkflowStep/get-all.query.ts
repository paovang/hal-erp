import { EntityManager } from 'typeorm';
import { ApprovalWorkflowStepQueryDto } from '../../dto/query/approval-workflow-step.dto';

export class GetAllQuery {
  constructor(
    public readonly id: number,
    public readonly dto: ApprovalWorkflowStepQueryDto,
    public readonly manager: EntityManager,
  ) {}
}
