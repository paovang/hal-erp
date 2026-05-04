import { EntityManager } from 'typeorm';
import { ReceiptExportQueryDto } from '../../dto/query/receipt-export.dto';

export class GetAllForExportQuery {
  constructor(
    public readonly dto: ReceiptExportQueryDto,
    public readonly manager: EntityManager,
  ) {}
}
