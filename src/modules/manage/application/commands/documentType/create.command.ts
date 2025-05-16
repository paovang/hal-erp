import { EntityManager } from "typeorm";
import { CreateDocumentTypeDto } from "../../dto/create/documentType/create.dto";

export class CreateCommand {
  constructor(
    public readonly dto: CreateDocumentTypeDto,
    public readonly manager: EntityManager,
  ) {}
}
