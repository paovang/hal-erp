import { EntityManager } from 'typeorm';
import { ApproveByTokenDto } from '../../dto/create/ApprovalWorkflow/approve-by-token.dto';

export class ApproveByTokenCommand {
  constructor(
    public readonly dto: ApproveByTokenDto,
    public readonly manager: EntityManager,
  ) {}
}
