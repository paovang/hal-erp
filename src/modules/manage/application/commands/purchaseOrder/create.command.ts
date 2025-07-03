import { EntityManager } from 'typeorm';
import { CreatePurchaseOrderDto } from '../../dto/create/purchaseOrder/create.dto';

export class CreateCommand {
  constructor(
    public readonly dto: CreatePurchaseOrderDto,
    public readonly manager: EntityManager,
  ) {}
}
