import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DocumentStatusOrmEntity } from '@src/common/infrastructure/database/typeorm/document-statuse.orm';
import { IReadDocumentStatusRepository } from '@src/modules/manage/domain/ports/output/document-status-repository.interface';
import { EntityManager, Repository } from 'typeorm';
import { DocumentStatusDataAccessMapper } from '../../mappers/document-status.mapper';
import { PAGINATION_SERVICE } from '@src/common/constants/inject-key.const';
import { DocumentStatusQueryDto } from '@src/modules/manage/application/dto/query/document-status.dto';
import {
  FilterOptions,
  IPaginationService,
  ResponseResult,
} from '@src/common/infrastructure/pagination/pagination.interface';
import { DocumentStatusEntity } from '@src/modules/manage/domain/entities/document-status.entity';

@Injectable()
export class ReadDocumentStatusRepository
  implements IReadDocumentStatusRepository
{
  constructor(
    @InjectRepository(DocumentStatusOrmEntity)
    private readonly _documentStatusOrm: Repository<DocumentStatusOrmEntity>,
    private readonly _dataAccessMapper: DocumentStatusDataAccessMapper,
    @Inject(PAGINATION_SERVICE)
    private readonly _paginationService: IPaginationService,
  ) {}

  async findAll(
    query: DocumentStatusQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<DocumentStatusEntity>> {
    const queryBuilder = await this.createBaseQuery(manager);
    query.sort_by = 'document_status.id';

    const data = await this._paginationService.paginate(
      queryBuilder,
      query,
      this._dataAccessMapper.toEntity.bind(this._dataAccessMapper),
      this.getFilterOptions(),
    );
    return data;
  }

  private createBaseQuery(manager: EntityManager) {
    return manager.createQueryBuilder(
      DocumentStatusOrmEntity,
      'document_status',
    );
  }

  private getFilterOptions(): FilterOptions {
    return {
      searchColumns: [],
      dateColumn: '',
      filterByColumns: [],
    };
  }
}
