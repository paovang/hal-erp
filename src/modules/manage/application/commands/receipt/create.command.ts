import { EntityManager } from 'typeorm';
import { CreateReceiptDto } from '../../dto/create/receipt/create.dto';

export class CreateCommand {
  constructor(
    public readonly dto: CreateReceiptDto,
    public readonly manager: EntityManager,
  ) {}
}
