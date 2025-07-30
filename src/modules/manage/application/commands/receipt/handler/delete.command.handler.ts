import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { DeleteCommand } from '../delete.command';
import { HttpStatus, Inject } from '@nestjs/common';
import {
  WRITE_RECEIPT_ITEM_REPOSITORY,
  WRITE_RECEIPT_REPOSITORY,
} from '../../../constants/inject-key.const';
import { IWriteReceiptRepository } from '@src/modules/manage/domain/ports/output/receipt-repository.interface';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { ReceiptOrmEntity } from '@src/common/infrastructure/database/typeorm/receipt.orm';
import { ReceiptId } from '@src/modules/manage/domain/value-objects/receitp-id.vo';
import { TRANSACTION_MANAGER_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';
import { IWriteReceiptItemRepository } from '@src/modules/manage/domain/ports/output/receipt-item-repository.interface';
import { ReceiptItemOrmEntity } from '@src/common/infrastructure/database/typeorm/receipt.item.orm';
import { ReceiptItemId } from '@src/modules/manage/domain/value-objects/receipt-item-id.vo';
import { UserApprovalStepOrmEntity } from '@src/common/infrastructure/database/typeorm/user-approval-step.orm';
import { STATUS_KEY } from '../../../constants/status-key.const';
import { UserApprovalOrmEntity } from '@src/common/infrastructure/database/typeorm/user-approval.orm';

@CommandHandler(DeleteCommand)
export class DeleteCommandHandler
  implements IQueryHandler<DeleteCommand, void>
{
  constructor(
    @Inject(WRITE_RECEIPT_REPOSITORY)
    private readonly _write: IWriteReceiptRepository,
    @Inject(WRITE_RECEIPT_ITEM_REPOSITORY)
    private readonly _writeItem: IWriteReceiptItemRepository,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
  ) {}

  async execute(query: DeleteCommand): Promise<void> {
    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        if (isNaN(query.id)) {
          throw new ManageDomainException(
            'errors.must_be_number',
            HttpStatus.BAD_REQUEST,
            { property: `${query.id}` },
          );
        }

        /** Check Exits Document Type Id */
        const receipt = await findOneOrFail(manager, ReceiptOrmEntity, {
          id: query.id,
        });

        const document_id = (receipt as any).document_id;
        // check user approval step before delete
        await this.checkStatusToUpdate(manager, document_id);

        // delete item
        await this.deleteItem(query.id, manager);
        return await this._write.delete(new ReceiptId(query.id), manager);
      },
    );
  }

  private async checkStatusToUpdate(
    manager: EntityManager,
    document_id: number,
  ): Promise<void> {
    const user_approval = await manager.findOne(UserApprovalOrmEntity, {
      where: {
        document_id: document_id,
      },
    });

    const user_approval_step = await manager.findOne(
      UserApprovalStepOrmEntity,
      {
        where: {
          user_approval_id: user_approval?.id,
          status_id: STATUS_KEY.APPROVED,
        },
      },
    );

    if (user_approval_step) {
      throw new ManageDomainException(
        'errors.cannot_update',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  private async deleteItem(
    receipt_id: number,
    manager: EntityManager,
  ): Promise<void> {
    const find_item = await manager.find(ReceiptItemOrmEntity, {
      where: { receipt_id: receipt_id },
    });

    for (const item of find_item) {
      await this._writeItem.delete(new ReceiptItemId(item.id), manager);
    }
  }
}
