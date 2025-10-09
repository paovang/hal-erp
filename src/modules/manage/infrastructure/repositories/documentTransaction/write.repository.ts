import { Injectable } from '@nestjs/common';
import { IWriteDocumentTransactionRepository } from '@src/modules/manage/domain/ports/output/document-transaction-repository.interface';
import { DocumentTransactionDataAccessMapper } from '../../mappers/document-transaction.mapper';
import { DocumentTransactionEntity } from '@src/modules/manage/domain/entities/document-transaction.entity';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { EntityManager } from 'typeorm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';

@Injectable()
export class WriteDocumentTransactionRepository
  implements IWriteDocumentTransactionRepository
{
  constructor(
    private readonly _dataAccessMapper: DocumentTransactionDataAccessMapper,
  ) {}

  async create(
    entity: DocumentTransactionEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<DocumentTransactionEntity>> {
    return this._dataAccessMapper.toEntity(
      await manager.save(
        this._dataAccessMapper.toOrmEntity(entity, OrmEntityMethod.CREATE),
      ),
    );
  }
}
