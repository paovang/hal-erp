import { EntityManager } from 'typeorm';
import { ApproveDto } from '../../dto/create/ApprovalWorkflow/approve.dto';

export class ApproveCommand {
  constructor(
    public readonly id: number,
    public readonly dto: ApproveDto,
    public readonly manager: EntityManager,
  ) {}
}
