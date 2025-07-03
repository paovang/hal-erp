import { EntityManager } from 'typeorm';
import { ApprovalDto } from '../../dto/create/userApprovalStep/update-statue.dto';

export class ApproveCommand {
  constructor(
    public readonly id: number,
    public readonly dto: ApprovalDto,
    public readonly manager: EntityManager,
  ) {}
}
