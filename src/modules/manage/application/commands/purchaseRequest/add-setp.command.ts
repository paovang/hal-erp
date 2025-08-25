import { EntityManager } from 'typeorm';
import { AddStepDto } from '../../dto/create/purchaseRequest/add-step.dto';

export class AddStepCommand {
  constructor(
    public readonly id: number,
    public readonly dto: AddStepDto,
    public readonly manager: EntityManager,
  ) {}
}
