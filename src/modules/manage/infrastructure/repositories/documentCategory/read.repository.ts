import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';

import { IReadDocumentCategoryRepository } from '@src/modules/manage/domain/ports/output/document-category-repository.interface';
import { DocumentCategoryEntity } from '@src/modules/manage/domain/entities/document-category.entity';
import { DocumentCategoryOrmEntity } from '@src/common/infrastructure/database/typeorm/document-category.orm';
import { DocumentCategoryDataAccessMapper } from '../../mappers/document-category.mapper';

@Injectable()
export class ReadDocumentCategoryRepository
  implements IReadDocumentCategoryRepository
{
  constructor(
    @InjectRepository(DocumentCategoryOrmEntity)
    private readonly _documentCategoryOrm: Repository<DocumentCategoryOrmEntity>,
    private readonly _dataAccessMapper: DocumentCategoryDataAccessMapper,
  ) {}

  async findAll(
    manager: EntityManager,
  ): Promise<ResponseResult<DocumentCategoryEntity>> {
    const ormEntities = await manager.find(DocumentCategoryOrmEntity);

    return ormEntities.map((ormEntity) =>
      this._dataAccessMapper.toEntity(ormEntity),
    );
  }
}
