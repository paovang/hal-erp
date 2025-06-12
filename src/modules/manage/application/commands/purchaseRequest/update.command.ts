import { EntityManager } from 'typeorm';

export class UpdateCommand {
  constructor(
    public readonly id: number,
    // public readonly dto: UpdateUnitDto,
    public readonly manager: EntityManager,
  ) {}
}
