import { EntityManager } from 'typeorm';
import { UpdateVendorBankAccountDto } from '../../dto/create/vendorBankAccount/update.dto';

export class UpdateCommand {
  constructor(
    public readonly id: number,
    public readonly dto: UpdateVendorBankAccountDto,
    public readonly manager: EntityManager,
  ) {}
}
