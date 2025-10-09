import { EntityManager } from 'typeorm';
import { UpdateReceiptDto } from '../../dto/create/receipt/update.dto';

export class UpdateCommand {
  constructor(
    public readonly id: number,
    public readonly dto: UpdateReceiptDto,
    public readonly manager: EntityManager,
  ) {}
}
