import { EntityManager } from 'typeorm';
import { SendApprovalMailDto } from '../../dto/create/ApprovalWorkflow/send-approval-mail.dto';

export class SendApprovalMailCommand {
  constructor(
    public readonly id: number,
    public readonly dto: SendApprovalMailDto,
    public readonly manager: EntityManager,
  ) {}
}
