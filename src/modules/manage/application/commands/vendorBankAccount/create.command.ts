import { EntityManager } from 'typeorm';
import { CreateVendorBankAccountDto } from '../../dto/create/vendorBankAccount/create.dto';

export class CreateCommand {
  constructor(
    public readonly dto: CreateVendorBankAccountDto,
    public readonly manager: EntityManager,
  ) {}
}
