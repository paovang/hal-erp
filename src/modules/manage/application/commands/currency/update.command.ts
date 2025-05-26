import { EntityManager } from 'typeorm';
import { UpdateCurrencyDto } from '../../dto/create/currency/update.dto';

export class UpdateCommand {
  constructor(
    public readonly id: number,
    public readonly dto: UpdateCurrencyDto,
    public readonly manager: EntityManager,
  ) {}
}
