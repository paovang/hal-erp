import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { DeleteCommand } from '../delete.command';
import { WRITE_DOCUMENT_TYPE_REPOSITORY } from '../../../constants/inject-key.const';
import { HttpStatus, Inject } from '@nestjs/common';
import { IWriteDocumentTypeRepository } from '@src/modules/manage/domain/ports/output/document-type-repository.interface';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { DocumentTypeOrmEntity } from '@src/common/infrastructure/database/typeorm/document-type.orm';
import { DocumentTypeId } from '@src/modules/manage/domain/value-objects/document-type-id.vo';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';

@CommandHandler(DeleteCommand)
export class DeleteCommandHandler
  implements IQueryHandler<DeleteCommand, void>
{
  constructor(
    @Inject(WRITE_DOCUMENT_TYPE_REPOSITORY)
    private readonly _write: IWriteDocumentTypeRepository,
  ) {}

  async execute(query: DeleteCommand): Promise<void> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
      );
    }

    /** Check Exits Document Type Id */
    await findOneOrFail(query.manager, DocumentTypeOrmEntity, {
      id: query.id,
    });

    return await this._write.delete(
      new DocumentTypeId(query.id),
      query.manager,
    );
  }
}
