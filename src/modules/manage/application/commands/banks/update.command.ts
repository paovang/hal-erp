import { EntityManager } from 'typeorm';
import { UpdateBankDto } from '../../dto/create/banks/update.dto';

export class UpdateBankCommand {
  constructor(
    public readonly id: number,
    public readonly dto: UpdateBankDto,
    public readonly logo: any,
    public readonly manager: EntityManager,
  ) {}
}
