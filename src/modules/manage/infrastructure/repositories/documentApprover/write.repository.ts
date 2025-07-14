import { Injectable } from '@nestjs/common';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { DocumentApproverEntity } from '@src/modules/manage/domain/entities/document-approver.entity';
import { IWriteDocumentApproverRepository } from '@src/modules/manage/domain/ports/output/document-approver-repository.interface';
import { EntityManager } from 'typeorm';
import { DocumentApproverDataAccessMapper } from '../../mappers/document-approver.mapper';

@Injectable()
export class WriteDocumentApproverRepository
  implements IWriteDocumentApproverRepository
{
  constructor(
    private readonly _dataAccessMapper: DocumentApproverDataAccessMapper,
  ) {}

  async create(
    entity: DocumentApproverEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<DocumentApproverEntity>> {
    return this._dataAccessMapper.toEntity(
      await manager.save(
        this._dataAccessMapper.toOrmEntity(entity, OrmEntityMethod.CREATE),
      ),
    );
  }
}
