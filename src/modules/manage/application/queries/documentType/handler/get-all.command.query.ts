import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { ResponseResult } from "@src/common/application/interfaces/pagination.interface";
import { DocumentTypeEntity } from "@src/modules/manage/domain/entities/document-type.entity";
import { Inject } from "@nestjs/common";
import { READ_DOCUMENT_TYPE_REPOSITORY } from "../../../constants/inject-key.const";
import { IReadDocumentTypeRepository } from "@src/modules/manage/domain/ports/output/document-type-repository.interface";
import { GetAllQuery } from "../get-all.query";

@QueryHandler(GetAllQuery)
export class GetAllQueryHandler
  implements IQueryHandler<GetAllQuery, ResponseResult<DocumentTypeEntity>>
{
  constructor(
    @Inject(READ_DOCUMENT_TYPE_REPOSITORY)
    private readonly _readRepo: IReadDocumentTypeRepository,
  ) {}

  async execute(query: GetAllQuery): Promise<ResponseResult<DocumentTypeEntity>> {
    return await this._readRepo.findAll(query.dto, query.manager);
  }
}