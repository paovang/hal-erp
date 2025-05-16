import { Injectable } from "@nestjs/common";
import { ResponseResult } from "@src/common/application/interfaces/pagination.interface";
import { DocumentTypeEntity } from "@src/modules/manage/domain/entities/document-type.entity";
import { IWriteDocumentTypeRepository } from "@src/modules/manage/domain/ports/output/document-type-repository.interface";
import { EntityManager } from "typeorm";
import { DocumentTypeDataAccessMapper } from "../../mappers/document-type.mapper";

@Injectable()
export class WriteDocumentTypeRepository implements IWriteDocumentTypeRepository {
  constructor(private readonly _dataAccessMapper: DocumentTypeDataAccessMapper) {}

  async create(
    entity: DocumentTypeEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<DocumentTypeEntity>> {
    return this._dataAccessMapper.toEntity(
      await manager.save(this._dataAccessMapper.toOrmEntity(entity)),
    );
  }

}