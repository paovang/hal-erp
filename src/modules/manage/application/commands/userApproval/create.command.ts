import { EntityManager } from 'typeorm';
import { CreateUserApprovalDto } from '../../dto/create/userApproval/create.dto';

export class CreateCommand {
  constructor(
    public readonly dto: CreateUserApprovalDto,
    public readonly manager: EntityManager,
  ) {}
}
