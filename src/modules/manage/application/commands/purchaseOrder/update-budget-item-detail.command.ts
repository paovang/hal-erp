import { EntityManager } from 'typeorm';
import { UpdatePurchaseOrderDto } from '../../dto/create/purchaseOrder/update.dto';

export class UpdateBudgetItemDetailCommand {
  constructor(
    public readonly id: number,
    public readonly dto: UpdatePurchaseOrderDto,
    public readonly manager: EntityManager,
  ) {}
}
