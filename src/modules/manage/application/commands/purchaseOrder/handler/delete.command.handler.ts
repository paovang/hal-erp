import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { DeleteCommand } from '../delete.command';
import { HttpStatus, Inject } from '@nestjs/common';
import {
  WRITE_DOCUMENT_REPOSITORY,
  WRITE_PURCHASE_ORDER_ITEM_REPOSITORY,
  WRITE_PURCHASE_ORDER_REPOSITORY,
  WRITE_PURCHASE_ORDER_SELECTED_VENDOR_REPOSITORY,
  WRITE_USER_APPROVAL_REPOSITORY,
  WRITE_USER_APPROVAL_STEP_REPOSITORY,
} from '../../../constants/inject-key.const';
import { IWritePurchaseOrderRepository } from '@src/modules/manage/domain/ports/output/purchase-order-repository.interface';
import { IWritePurchaseOrderItemRepository } from '@src/modules/manage/domain/ports/output/purchase-order-item-repository.interface';
import { IWriteDocumentRepository } from '@src/modules/manage/domain/ports/output/document-repository.interface';
import { IWriteUserApprovalRepository } from '@src/modules/manage/domain/ports/output/user-approval-repository.interface';
import { IWriteUserApprovalStepRepository } from '@src/modules/manage/domain/ports/output/user-approval-step-repository.interface';
import { TRANSACTION_MANAGER_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { IWritePurchaseOrderSelectedVendorRepository } from '@src/modules/manage/domain/ports/output/Purchase-order-selected-vendor-repository.interface';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { PurchaseOrderOrmEntity } from '@src/common/infrastructure/database/typeorm/purchase-order.orm';
import { PurchaseOrderItemOrmEntity } from '@src/common/infrastructure/database/typeorm/purchase-order-item.orm';
import { PurchaseOrderItemId } from '@src/modules/manage/domain/value-objects/purchase-order-item-id.vo';
import { DocumentOrmEntity } from '@src/common/infrastructure/database/typeorm/document.orm';
import { DocumentId } from '@src/modules/manage/domain/value-objects/document-id.vo';
import { UserApprovalOrmEntity } from '@src/common/infrastructure/database/typeorm/user-approval.orm';
import { UserApprovalStepOrmEntity } from '@src/common/infrastructure/database/typeorm/user-approval-step.orm';
import { STATUS_KEY } from '../../../constants/status-key.const';
import { UserApprovalStepId } from '@src/modules/manage/domain/value-objects/user-approval-step-id.vo';
import { UserApprovalId } from '@src/modules/manage/domain/value-objects/user-approval-id.vo';
import { PurchaseOrderId } from '@src/modules/manage/domain/value-objects/purchase-order-id.vo';
import { PurchaseOrderSelectedVendorOrmEntity } from '@src/common/infrastructure/database/typeorm/purchase-order-selected-vendor.orm';
import { PurchaseOrderSelectedVendorId } from '@src/modules/manage/domain/value-objects/purchase-order-selected-vendor-id.vo';

@CommandHandler(DeleteCommand)
export class DeleteCommandHandler
  implements IQueryHandler<DeleteCommand, void>
{
  constructor(
    @Inject(WRITE_PURCHASE_ORDER_REPOSITORY)
    private readonly _write: IWritePurchaseOrderRepository,
    // item
    @Inject(WRITE_PURCHASE_ORDER_ITEM_REPOSITORY)
    private readonly _writeItem: IWritePurchaseOrderItemRepository,
    // document
    @Inject(WRITE_DOCUMENT_REPOSITORY)
    private readonly _writeD: IWriteDocumentRepository,
    // select vendor
    @Inject(WRITE_PURCHASE_ORDER_SELECTED_VENDOR_REPOSITORY)
    private readonly _writeSV: IWritePurchaseOrderSelectedVendorRepository,

    // user approval
    @Inject(WRITE_USER_APPROVAL_REPOSITORY)
    private readonly _writeUserApproval: IWriteUserApprovalRepository,
    // user approval step
    @Inject(WRITE_USER_APPROVAL_STEP_REPOSITORY)
    private readonly _writeUserApprovalStep: IWriteUserApprovalStepRepository,
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

        const po = await findOneOrFail(manager, PurchaseOrderOrmEntity, {
          id: query.id,
        });

        const document_id = (po as any).document_id;

        await this.deleteItem(manager, query.id);

        await this.deleteDocument(document_id, manager);

        await this.deleteUserApproval(manager, document_id);

        return await this._write.delete(new PurchaseOrderId(query.id), manager);
      },
    );
  }

  private async checkData(query: DeleteCommand): Promise<void> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async deleteItem(
    manager: DataSource['manager'],
    po_id: number,
  ): Promise<void> {
    const po_item = await manager.find(PurchaseOrderItemOrmEntity, {
      where: {
        purchase_order_id: po_id,
      },
    });

    for (const item of po_item) {
      await this._writeItem.delete(new PurchaseOrderItemId(item.id), manager);

      await this.deleteSelectedVendor(item.id, manager);
    }
  }

  private async deleteDocument(
    document_id: number,
    manager: DataSource['manager'],
  ): Promise<void> {
    const document = await findOneOrFail(manager, DocumentOrmEntity, {
      id: document_id,
    });

    return await this._writeD.delete(new DocumentId(document.id), manager);
  }

  private async deleteUserApproval(
    manager: DataSource['manager'],
    document_id: number,
  ): Promise<void> {
    const user_approval = await findOneOrFail(manager, UserApprovalOrmEntity, {
      document_id: document_id,
    });

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
        manager,
      );
    }

    await this._writeUserApproval.delete(
      new UserApprovalId(user_approval_id),
      manager,
    );
  }

  private async deleteSelectedVendor(
    item_id: number,
    manager: DataSource['manager'],
  ): Promise<void> {
    const selected_vendor = await manager.find(
      PurchaseOrderSelectedVendorOrmEntity,
      {
        where: {
          purchase_order_item_id: item_id,
        },
      },
    );

    for (const vendor of selected_vendor) {
      await this._writeSV.delete(
        new PurchaseOrderSelectedVendorId(vendor.id),
        manager,
      );
    }
  }
}
