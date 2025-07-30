import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { DeleteCommand } from '../delete.command';
import { HttpStatus, Inject } from '@nestjs/common';
import { WRITE_DOCUMENT_REPOSITORY } from '../../../constants/inject-key.const';
import { IWriteDocumentRepository } from '@src/modules/manage/domain/ports/output/document-repository.interface';
import { DocumentId } from '@src/modules/manage/domain/value-objects/document-id.vo';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { DocumentOrmEntity } from '@src/common/infrastructure/database/typeorm/document.orm';
import { checkRelationOrThrow } from '@src/common/utils/check-relation-or-throw.util';
import { PurchaseOrderOrmEntity } from '@src/common/infrastructure/database/typeorm/purchase-order.orm';
import { PurchaseRequestOrmEntity } from '@src/common/infrastructure/database/typeorm/purchase-request.orm';
import { ReceiptOrmEntity } from '@src/common/infrastructure/database/typeorm/receipt.orm';
import { UserApprovalOrmEntity } from '@src/common/infrastructure/database/typeorm/user-approval.orm';
import { DocumentAttachmentOrmEntity } from '@src/common/infrastructure/database/typeorm/document-attachment.orm';
import { DocumentTransactionOrmEntity } from '@src/common/infrastructure/database/typeorm/document-transaction.orm';

@CommandHandler(DeleteCommand)
export class DeleteCommandHandler
  implements IQueryHandler<DeleteCommand, void>
{
  constructor(
    @Inject(WRITE_DOCUMENT_REPOSITORY)
    private readonly _write: IWriteDocumentRepository,
  ) {}

  async execute(query: DeleteCommand): Promise<void> {
    await this.checkData(query);

    return await this._write.delete(new DocumentId(query.id), query.manager);
  }

  private async checkData(query: DeleteCommand): Promise<void> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
        { property: `${query.id}` },
      );
    }

    /** Check Exits Document Type Id */
    await findOneOrFail(query.manager, DocumentOrmEntity, {
      id: query.id,
    });

    await checkRelationOrThrow(
      query.manager,
      PurchaseOrderOrmEntity,
      { document_id: query.id },
      'errors.already_in_use',
      HttpStatus.BAD_REQUEST,
      'purchase order',
    );

    await checkRelationOrThrow(
      query.manager,
      PurchaseRequestOrmEntity,
      { document_id: query.id },
      'errors.already_in_use',
      HttpStatus.BAD_REQUEST,
      'purchase request',
    );

    await checkRelationOrThrow(
      query.manager,
      ReceiptOrmEntity,
      { document_id: query.id },
      'errors.already_in_use',
      HttpStatus.BAD_REQUEST,
      'receipt',
    );

    await checkRelationOrThrow(
      query.manager,
      UserApprovalOrmEntity,
      { document_id: query.id },
      'errors.already_in_use',
      HttpStatus.BAD_REQUEST,
      'user approval',
    );

    await checkRelationOrThrow(
      query.manager,
      DocumentAttachmentOrmEntity,
      { document_id: query.id },
      'errors.already_in_use',
      HttpStatus.BAD_REQUEST,
      'document attachment',
    );

    await checkRelationOrThrow(
      query.manager,
      DocumentTransactionOrmEntity,
      { document_id: query.id },
      'errors.already_in_use',
      HttpStatus.BAD_REQUEST,
      'document transaction',
    );
  }
}
