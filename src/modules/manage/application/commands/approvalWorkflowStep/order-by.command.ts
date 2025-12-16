import { EntityManager } from 'typeorm';
import { OrderByApprovalWorkflowStepDto } from '../../dto/create/approvalWorkflowStep/order-by.dto';

export class OrderByCommand {
  constructor(
    public readonly id: number,
    public readonly dto: OrderByApprovalWorkflowStepDto,
    public readonly manager: EntityManager,
  ) {}
}
