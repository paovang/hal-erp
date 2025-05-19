import { EntityManager } from "typeorm";
import { UpdateUserDto } from "../../dto/create/user/update.dto";

export class UpdateCommand {
  constructor(
    public readonly id: number,
    public readonly dto: UpdateUserDto,
    public readonly manager: EntityManager,
  ) {}
}