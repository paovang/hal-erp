import { EntityManager } from 'typeorm';
import { CreatePositionDto } from '../../dto/create/position/create.dto';

export class CreateCommand {
  constructor(
    public readonly dto: CreatePositionDto,
    public readonly manager: EntityManager,
  ) {}
}
