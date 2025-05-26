import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOneQuery } from '../get-one.query';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { DocumentTypeEntity } from '@src/modules/manage/domain/entities/document-type.entity';
import { BadRequestException, Inject } from '@nestjs/common';
import { READ_DOCUMENT_TYPE_REPOSITORY } from '../../../constants/inject-key.const';
import { IReadDocumentTypeRepository } from '@src/modules/manage/domain/ports/output/document-type-repository.interface';
import { DocumentTypeId } from '@src/modules/manage/domain/value-objects/document-type-id.vo';
import { DocumentTypeOrmEntity } from '@src/common/infrastructure/database/typeorm/document-type.orm';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';

@QueryHandler(GetOneQuery)
export class GetOneQueryHandler
  implements IQueryHandler<GetOneQuery, ResponseResult<DocumentTypeEntity>>
{
  constructor(
    @Inject(READ_DOCUMENT_TYPE_REPOSITORY)
    private readonly _readRepo: IReadDocumentTypeRepository,
  ) {}

  async execute(
    query: GetOneQuery,
  ): Promise<ResponseResult<DocumentTypeEntity>> {
    if (isNaN(query.id)) {
      throw new BadRequestException('id must be a number');
    }

    await findOneOrFail(query.manager, DocumentTypeOrmEntity, {
      id: query.id,
    });

    return await this._readRepo.findOne(
      new DocumentTypeId(query.id),
      query.manager,
    );
  }
}
