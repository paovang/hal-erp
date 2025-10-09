import { EntityManager } from 'typeorm';
import { CreatePurchaseRequestDto } from '../../dto/create/purchaseRequest/create.dto';

export class CreateCommand {
  constructor(
    public readonly dto: CreatePurchaseRequestDto,
    public readonly manager: EntityManager,
  ) {}
}
