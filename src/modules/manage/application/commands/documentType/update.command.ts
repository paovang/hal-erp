import { EntityManager } from "typeorm";
import { UpdateDocumentTypeDto } from "../../dto/create/documentType/update.dto";

export class UpdateCommand {
  constructor(
    public readonly id: number,
    public readonly dto: UpdateDocumentTypeDto,
    public readonly manager: EntityManager,
  ) {}
}