import { EntityManager } from 'typeorm';
import { CreateBankDto } from '../../dto/create/banks/create.dto';

export class CreateBankCommand {
  constructor(
    public readonly dto: CreateBankDto,
    public readonly logo: any,
    public readonly manager: EntityManager,
  ) {}
}
