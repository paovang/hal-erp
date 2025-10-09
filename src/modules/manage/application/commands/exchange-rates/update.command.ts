import { EntityManager } from 'typeorm';
import { UpdateExchangeRateDto } from '../../dto/create/exchange-rates/update.dto';

export class UpdateExchangeRateCommand {
  constructor(
    public readonly id: number,
    public readonly dto: UpdateExchangeRateDto,
    public readonly manager: EntityManager,
  ) {}
}
