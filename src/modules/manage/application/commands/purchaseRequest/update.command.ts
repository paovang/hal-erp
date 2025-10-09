import { EntityManager } from 'typeorm';
import { UpdatePurchaseRequestDto } from '../../dto/create/purchaseRequest/update.dto';

export class UpdateCommand {
  constructor(
    public readonly id: number,
    public readonly dto: UpdatePurchaseRequestDto,
    public readonly manager: EntityManager,
  ) {}
}
