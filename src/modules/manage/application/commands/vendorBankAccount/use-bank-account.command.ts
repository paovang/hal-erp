import { EntityManager } from 'typeorm';
import { UseBankAccountDto } from '../../dto/create/vendorBankAccount/use-bank-account.dto';

export class UseBankAccountCommand {
  constructor(
    public readonly id: number,
    public readonly dto: UseBankAccountDto,
    public readonly manager: EntityManager,
  ) {}
}
