import { EntityManager } from 'typeorm';
import { BankQueryDto } from '../../dto/query/bank-query.dto';

export class GetAllBankQuery {
  constructor(
    public readonly dto: BankQueryDto,
    public readonly manager: EntityManager,
  ) {}
}
