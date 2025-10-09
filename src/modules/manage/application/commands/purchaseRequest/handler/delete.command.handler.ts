import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { DeleteCommand } from '../delete.command';
import { HttpStatus, Inject } from '@nestjs/common';
import {
  WRITE_DOCUMENT_APPROVER_REPOSITORY,
  WRITE_DOCUMENT_REPOSITORY,
  WRITE_PURCHASE_REQUEST_ITEM_REPOSITORY,
  WRITE_PURCHASE_REQUEST_REPOSITORY,
  WRITE_USER_APPROVAL_REPOSITORY,
  WRITE_USER_APPROVAL_STEP_REPOSITORY,
} from '../../../constants/inject-key.const';
import { IWritePurchaseRequestRepository } from '@src/modules/manage/domain/ports/output/purchase-request-repository.interface';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { PurchaseRequestId } from '@src/modules/manage/domain/value-objects/purchase-request-id.vo';
import { PurchaseRequestOrmEntity } from '@src/common/infrastructure/database/typeorm/purchase-request.orm';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { IWritePurchaseRequestItemRepository } from '@src/modules/manage/domain/ports/output/purchase-request-item-repository.interface';
import { IWriteDocumentRepository } from '@src/modules/manage/domain/ports/output/document-repository.interface';
import { IWriteUserApprovalRepository } from '@src/modules/manage/domain/ports/output/user-approval-repository.interface';
import { IWriteUserApprovalStepRepository } from '@src/modules/manage/domain/ports/output/user-approval-step-repository.interface';
import { TRANSACTION_MANAGER_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PurchaseRequestItemOrmEntity } from '@src/common/infrastructure/database/typeorm/purchase-request-item.orm';
import { PurchaseRequestItemId } from '@src/modules/manage/domain/value-objects/purchase-request-item-id.vo';
import { DocumentOrmEntity } from '@src/common/infrastructure/database/typeorm/document.orm';
import { DocumentId } from '@src/modules/manage/domain/value-objects/document-id.vo';
import { UserApprovalOrmEntity } from '@src/common/infrastructure/database/typeorm/user-approval.orm';
import { UserApprovalStepOrmEntity } from '@src/common/infrastructure/database/typeorm/user-approval-step.orm';
import { UserApprovalStepId } from '@src/modules/manage/domain/value-objects/user-approval-step-id.vo';
import { UserApprovalId } from '@src/modules/manage/domain/value-objects/user-approval-id.vo';
import { STATUS_KEY } from '../../../constants/status-key.const';
import { assertOrThrow } from '@src/common/utils/assert.util';
import { DocumentApproverOrmEntity } from '@src/common/infrastructure/database/typeorm/document-approver.orm';
import { IWriteDocumentApproverRepository } from '@src/modules/manage/domain/ports/output/document-approver-repository.interface';
import { DocumentApproverId } from '@src/modules/manage/domain/value-objects/document-approver-id.vo';
import { checkRelationOrThrow } from '@src/common/utils/check-relation-or-throw.util';
import { PurchaseOrderOrmEntity } from '@src/common/infrastructure/database/typeorm/purchase-order.orm';

@CommandHandler(DeleteCommand)
export class DeleteCommandHandler
  implements IQueryHandler<DeleteCommand, void>
{
  constructor(
    @Inject(WRITE_PURCHASE_REQUEST_REPOSITORY)
    private readonly _write: IWritePurchaseRequestRepository,
    // item
    @Inject(WRITE_PURCHASE_REQUEST_ITEM_REPOSITORY)
    private readonly _writeItem: IWritePurchaseRequestItemRepository,
    // document
    @Inject(WRITE_DOCUMENT_REPOSITORY)
    private readonly _writeD: IWriteDocumentRepository,
    // user approval
    @Inject(WRITE_USER_APPROVAL_REPOSITORY)
    private readonly _writeUserApproval: IWriteUserApprovalRepository,
    // user approval step
    @Inject(WRITE_USER_APPROVAL_STEP_REPOSITORY)
    private readonly _writeUserApprovalStep: IWriteUserApprovalStepRepository,
    // document approver
    @Inject(WRITE_DOCUMENT_APPROVER_REPOSITORY)
    private readonly _writeDocumentApprover: IWriteDocumentApproverRepository,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
  ) {}

  async execute(query: DeleteCommand): Promise<void> {
    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        await this.checkData(query);

        /** Check Exits Document Type Id */
        const pr = await findOneOrFail(
          query.manager,
          PurchaseRequestOrmEntity,
          {
            id: query.id,
          },
        );

        const pr_id = (pr as any).id;
        const document_id = (pr as any).document_id;

        await this.deleteItem(query, pr_id);

        await this.deleteDocument(query, document_id, manager);

        await this.deleteUserApproval(query, document_id, manager);

        return await this._write.delete(
          new PurchaseRequestId(query.id),
          manager,
        );
      },
    );
  }

  private async checkData(query: DeleteCommand): Promise<void> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
        { property: `${query.id}` },
      );
    }

    await checkRelationOrThrow(
      query.manager,
      PurchaseOrderOrmEntity,
      { purchase_request_id: query.id },
      'errors.already_in_use',
      HttpStatus.BAD_REQUEST,
      'purchase order',
    );
  }

  private async deleteItem(query: DeleteCommand, pr_id: number): Promise<void> {
    const pr_item = await query.manager.find(PurchaseRequestItemOrmEntity, {
      where: {
        purchase_request_id: pr_id,
      },
    });

    for (const item of pr_item) {
      return await this._writeItem.delete(
        new PurchaseRequestItemId(item.id),
        query.manager,
      );
    }
  }

  private async deleteDocument(
    query: DeleteCommand,
    document_id: number,
    manager: DataSource['manager'],
  ): Promise<void> {
    const document = await findOneOrFail(manager, DocumentOrmEntity, {
      id: document_id,
    });

    return await this._writeD.delete(
      new DocumentId(document.id),
      query.manager,
    );
  }

  private async deleteUserApproval(
    query: DeleteCommand,
    document_id: number,
    manager: DataSource['manager'],
  ): Promise<void> {
    const user_approval = await findOneOrFail(
      query.manager,
      UserApprovalOrmEntity,
      {
        document_id: document_id,
      },
    );

    const user_approval_id = (user_approval as any).id;

    const user_approval_step = await manager.find(UserApprovalStepOrmEntity, {
      where: {
        user_approval_id: user_approval_id,
      },
    });

    for (const step of user_approval_step) {
      if (step.status_id === STATUS_KEY.APPROVED) {
        throw new ManageDomainException(
          'errors.cannot_delete',
          HttpStatus.FORBIDDEN,
        );
      }
      await this._writeUserApprovalStep.delete(
        new UserApprovalStepId(step.id),
        query.manager,
      );

      await this.deleteDocumentApprover(step.id, manager);
    }

    await this._writeUserApproval.delete(
      new UserApprovalId(user_approval_id),
      query.manager,
    );
  }

  private async deleteDocumentApprover(
    step_id: number,
    manager: DataSource['manager'],
  ): Promise<void> {
    const document_approver = await manager.find(DocumentApproverOrmEntity, {
      where: {
        user_approval_step_id: step_id,
      },
    });

    for (const approver of document_approver) {
      assertOrThrow(
        approver,
        'errors.not_found',
        HttpStatus.NOT_FOUND,
        'approver',
      );
      await this._writeDocumentApprover.delete(
        new DocumentApproverId(approver.id),
        manager,
      );
    }
  }
}
