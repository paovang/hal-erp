import { EntityManager } from 'typeorm';
import { ApprovalDto } from '../../dto/create/userApprovalStep/update-statue.dto';

export class ApproveStepCommand {
  constructor(
    public readonly stepId: number,
    public readonly dto: ApprovalDto,
    public readonly manager: EntityManager,
  ) {}
}
