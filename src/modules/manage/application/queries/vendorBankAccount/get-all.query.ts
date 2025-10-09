import { EntityManager } from 'typeorm';
import { VendorBankAccountQueryDto } from '../../dto/query/vendor-bank-account-query.dto';

export class GetAllQuery {
  constructor(
    public readonly id: number,
    public readonly dto: VendorBankAccountQueryDto,
    public readonly manager: EntityManager,
  ) {}
}
