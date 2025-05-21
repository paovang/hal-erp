import { EntityManager } from "typeorm";
import { DocumentTypeQueryDto } from "../../dto/query/document-type-query.dto";

export class GetAllQuery {
  constructor(
    public readonly dto: DocumentTypeQueryDto,
    public readonly manager: EntityManager,
  ) {}
}