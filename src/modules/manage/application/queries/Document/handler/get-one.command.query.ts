import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOneQuery } from '../get-one.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { DocumentEntity } from '@src/modules/manage/domain/entities/document.entity';
import { HttpStatus, Inject } from '@nestjs/common';
import { READ_DOCUMENT_REPOSITORY } from '../../../constants/inject-key.const';
import { IReadDocumentRepository } from '@src/modules/manage/domain/ports/output/document-repository.interface';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { DocumentOrmEntity } from '@src/common/infrastructure/database/typeorm/document.orm';
import { DocumentId } from '@src/modules/manage/domain/value-objects/document-id.vo';

@QueryHandler(GetOneQuery)
export class GetOneQueryHandler
  implements IQueryHandler<GetOneQuery, ResponseResult<DocumentEntity>>
{
  constructor(
    @Inject(READ_DOCUMENT_REPOSITORY)
    private readonly _readRepo: IReadDocumentRepository,
  ) {}

  async execute(query: GetOneQuery): Promise<ResponseResult<DocumentEntity>> {
    await this.checkData(query);
    return await this._readRepo.findOne(
      new DocumentId(query.id),
      query.manager,
    );
  }

  private async checkData(query: GetOneQuery): Promise<void> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
      );
    }

    await findOneOrFail(query.manager, DocumentOrmEntity, {
      id: query.id,
    });
  }
}
