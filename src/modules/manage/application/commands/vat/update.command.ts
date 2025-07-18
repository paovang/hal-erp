import { EntityManager } from 'typeorm';
import { UpdateVatDto } from '../../dto/create/vat/update.dto';

export class UpdateVatCommand {
  constructor(
    public readonly id: number,
    public readonly dto: UpdateVatDto,
    public readonly manager: EntityManager,
  ) {}
}
