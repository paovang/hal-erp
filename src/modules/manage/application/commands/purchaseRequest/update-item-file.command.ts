import { EntityManager } from 'typeorm';
import { UpdatePurchaseRequestItemFileDto } from '../../dto/create/purchaseRequest/update-item-file.dto';

export class UpdateItemFileCommand {
  constructor(
    public readonly id: number,
    public readonly dto: UpdatePurchaseRequestItemFileDto,
    public readonly manager: EntityManager,
  ) {}
}
