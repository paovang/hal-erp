import { EntityManager } from "typeorm";
import { CreateUnitDto } from "../../dto/create/unit/create.dto";

export class CreateCommand {
  constructor(
    public readonly dto: CreateUnitDto,
    public readonly manager: EntityManager,
  ) {}
}