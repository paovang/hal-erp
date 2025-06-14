import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DocumentOrmEntity } from '@src/common/infrastructure/database/typeorm/document.orm';
import { IReadDocumentRepository } from '@src/modules/manage/domain/ports/output/document-repository.interface';
import { DocumentDataAccessMapper } from '../../mappers/document.mapper';
import { PAGINATION_SERVICE } from '@src/common/constants/inject-key.const';
import {
  FilterOptions,
  IPaginationService,
  ResponseResult,
} from '@src/common/infrastructure/pagination/pagination.interface';
import { DocumentQueryDto } from '@src/modules/manage/application/dto/query/document.dto';
import { DocumentEntity } from '@src/modules/manage/domain/entities/document.entity';
import { EntityManager, Repository } from 'typeorm';
import { DocumentId } from '@src/modules/manage/domain/value-objects/document-id.vo';

@Injectable()
export class ReadDocumentRepository implements IReadDocumentRepository {
  constructor(
    @InjectRepository(DocumentOrmEntity)
    private readonly _documentTypeOrm: Repository<DocumentOrmEntity>,
    private readonly _dataAccessMapper: DocumentDataAccessMapper,
    @Inject(PAGINATION_SERVICE)
    private readonly _paginationService: IPaginationService,
  ) {}
  async findAll(
    query: DocumentQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<DocumentEntity>> {
    const queryBuilder = await this.createBaseQuery(manager);
    query.sort_by = 'documents.id';

    const data = await this._paginationService.paginate(
      queryBuilder,
      query,
      this._dataAccessMapper.toEntity.bind(this._dataAccessMapper),
      this.getFilterOptions(),
    );
    return data;
  }

  async findOne(
    id: DocumentId,
    manager: EntityManager,
  ): Promise<ResponseResult<DocumentEntity>> {
    const item = await this.createBaseQuery(manager)
      .where('documents.id = :id', { id: id.value })
      .getOneOrFail();

    return this._dataAccessMapper.toEntity(item);
  }

  private createBaseQuery(manager: EntityManager) {
    return manager
      .createQueryBuilder(DocumentOrmEntity, 'documents')
      .leftJoin('documents.departments', 'departments')
      .leftJoin('documents.users', 'users')
      .leftJoin('users.user_signatures', 'user_signatures')
      .leftJoin('documents.document_types', 'document_types')
      .addSelect([
        'departments.id',
        'departments.name',
        'departments.code',
        'departments.created_at',
        'departments.updated_at',
        'users.id',
        'users.username',
        'users.email',
        'users.tel',
        'users.created_at',
        'users.updated_at',
      ])
      .addSelect([
        'user_signatures.id',
        'user_signatures.user_id',
        'user_signatures.signature_file',
        'user_signatures.created_at',
        'user_signatures.updated_at',
      ])
      .addSelect([
        'document_types.id',
        'document_types.code',
        'document_types.name',
        'document_types.created_at',
        'document_types.updated_at',
      ]);
  }

  private getFilterOptions(): FilterOptions {
    return {
      searchColumns: [
        'documents.document_number',
        'documents.title',
        'departments.code',
        'departments.name',
        'users.username',
        'users.email',
        'users.tel',
      ],
      dateColumn: '',
      filterByColumns: [],
    };
  }
}
