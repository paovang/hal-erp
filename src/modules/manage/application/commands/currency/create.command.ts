import { EntityManager } from 'typeorm';
import { CreateCurrencyDto } from '../../dto/create/currency/create.dto';

export class CreateCommand {
  constructor(
    public readonly dto: CreateCurrencyDto,
    public readonly manager: EntityManager,
  ) {}
}
