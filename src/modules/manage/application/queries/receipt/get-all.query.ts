import { EntityManager } from 'typeorm';
import { ReceiptQueryDto } from '../../dto/query/receipt.dto';

export class GetAllQuery {
  constructor(
    public readonly dto: ReceiptQueryDto,
    public readonly manager: EntityManager,
  ) {}
}
