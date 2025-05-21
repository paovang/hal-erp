import { EntityManager } from "typeorm";
import { CreateUserDto } from "../../dto/create/user/create.dto";

export class CreateCommand {
  constructor(
    public readonly dto: CreateUserDto,
    public readonly manager: EntityManager,
  ) {}
}