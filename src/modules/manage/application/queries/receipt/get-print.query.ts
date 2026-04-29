import { EntityManager } from 'typeorm';
import { ReceiptQueryDto } from '../../dto/query/receipt.dto';

export class GetPrintQuery {
  constructor(
    public readonly id: number,
    public readonly query: ReceiptQueryDto,
    public readonly manager: EntityManager,
  ) {}
}
