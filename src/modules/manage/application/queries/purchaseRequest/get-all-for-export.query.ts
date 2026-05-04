import { EntityManager } from 'typeorm';
import { PurchaseRequestExportQueryDto } from '../../dto/query/purchase-request-export.dto';

export class GetAllForExportQuery {
  constructor(
    public readonly dto: PurchaseRequestExportQueryDto,
    public readonly manager: EntityManager,
  ) {}
}
