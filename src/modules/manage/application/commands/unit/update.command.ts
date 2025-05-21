import { EntityManager } from "typeorm";
import { UpdateUnitDto } from "../../dto/create/unit/update.dto";

export class UpdateCommand {
  constructor(
    public readonly id: number,
    public readonly dto: UpdateUnitDto,
    public readonly manager: EntityManager,
  ) {}
}