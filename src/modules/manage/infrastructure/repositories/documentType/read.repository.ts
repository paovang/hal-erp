import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PAGINATION_SERVICE } from '@src/common/constants/inject-key.const';
import { DocumentTypeOrmEntity } from '@src/common/infrastructure/database/typeorm/document-type.orm';
import { EntityManager, Repository } from 'typeorm';
import { DocumentTypeDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/document-type.mapper';
import {
  FilterOptions,
  IPaginationService,
  ResponseResult,
} from '@common/infrastructure/pagination/pagination.interface';
import { IReadDocumentTypeRepository } from '@src/modules/manage/domain/ports/output/document-type-repository.interface';
import { DocumentTypeEntity } from '@src/modules/manage/domain/entities/document-type.entity';
import { DocumentTypeQueryDto } from '@src/modules/manage/application/dto/query/document-type-query.dto';
import { DocumentTypeId } from '@src/modules/manage/domain/value-objects/document-type-id.vo';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { StatusEnum } from '@src/common/enums/status.enum';

@Injectable()
export class ReadDocumentTypeRepository implements IReadDocumentTypeRepository {
  constructor(
    @InjectRepository(DocumentTypeOrmEntity)
    private readonly _documentTypeOrm: Repository<DocumentTypeOrmEntity>,
    private readonly _dataAccessMapper: DocumentTypeDataAccessMapper,
    @Inject(PAGINATION_SERVICE)
    private readonly _paginationService: IPaginationService,
  ) {}

  async findAll(
    query: DocumentTypeQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<DocumentTypeEntity>> {
    const status = query.status as StatusEnum;
    const queryBuilder = await this.createBaseQuery(manager, status);
    query.sort_by = 'document_types.id';

    const data = await this._paginationService.paginate(
      queryBuilder,
      query,
      this._dataAccessMapper.toEntity.bind(this._dataAccessMapper),
      this.getFilterOptions(),
    );
    return data;
  }

  async findOne(
    id: DocumentTypeId,
    manager: EntityManager,
  ): Promise<ResponseResult<DocumentTypeEntity>> {
    const item = await findOneOrFail(manager, DocumentTypeOrmEntity, {
      id: id.value,
    });

    return this._dataAccessMapper.toEntity(item);
  }

  private createBaseQuery(manager: EntityManager, status?: StatusEnum) {
    const query = manager
      .createQueryBuilder(DocumentTypeOrmEntity, 'document_types')
      .leftJoin('document_types.approval_workflows', 'approval_workflows');
    if (status) {
      query.andWhere('approval_workflows.status = :status', { status });
    }
    return query;
  }

  private getFilterOptions(): FilterOptions {
    return {
      searchColumns: ['document_types.code', 'document_types.name'],
      dateColumn: '',
      filterByColumns: [],
    };
  }
}
