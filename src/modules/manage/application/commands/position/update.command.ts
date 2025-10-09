import { EntityManager } from 'typeorm';
import { UpdatePositionDto } from '../../dto/create/position/update.dto';

export class UpdateCommand {
  constructor(
    public readonly id: number,
    public readonly dto: UpdatePositionDto,
    public readonly manager: EntityManager,
  ) {}
}
