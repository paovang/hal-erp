import { EntityManager } from 'typeorm';
import { CreateExchangeRateDto } from '../../dto/create/exchange-rates/create.dto';

export class CreateExchangeRateCommand {
  constructor(
    public readonly dto: CreateExchangeRateDto,
    public readonly manager: EntityManager,
  ) {}
}
