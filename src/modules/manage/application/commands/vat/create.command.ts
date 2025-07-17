import { EntityManager } from 'typeorm';
import { CreateVatDto } from '../../dto/create/vat/create.dto';

export class CreateVatCommand {
  constructor(
    public readonly dto: CreateVatDto,
    public readonly manager: EntityManager,
  ) {}
}
