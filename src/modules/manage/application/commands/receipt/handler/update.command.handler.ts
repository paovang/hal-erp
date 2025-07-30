import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { UpdateCommand } from '../update.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ReceiptEntity } from '@src/modules/manage/domain/entities/receipt.entity';
import { HttpStatus, Inject } from '@nestjs/common';
import {
  WRITE_RECEIPT_ITEM_REPOSITORY,
  WRITE_RECEIPT_REPOSITORY,
} from '../../../constants/inject-key.const';
import { IWriteReceiptRepository } from '@src/modules/manage/domain/ports/output/receipt-repository.interface';
import { ReceiptDataMapper } from '../../../mappers/receipt.mapper';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { IWriteReceiptItemRepository } from '@src/modules/manage/domain/ports/output/receipt-item-repository.interface';
import { ReceiptItemDataMapper } from '../../../mappers/receipt-item.mapper';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { ReceiptOrmEntity } from '@src/common/infrastructure/database/typeorm/receipt.orm';
import { ReceiptId } from '@src/modules/manage/domain/value-objects/receitp-id.vo';
import {
  EnumPaymentType,
  STATUS_KEY,
} from '../../../constants/status-key.const';
import { TRANSACTION_MANAGER_SERVICE } from '@src/common/constants/inject-key.const';
import { InjectDataSource } from '@nestjs/typeorm';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { DataSource, EntityManager } from 'typeorm';
import { ExchangeRateOrmEntity } from '@src/common/infrastructure/database/typeorm/exchange-rate.orm';
import { ReceiptItemOrmEntity } from '@src/common/infrastructure/database/typeorm/receipt.item.orm';
import { assertOrThrow } from '@src/common/utils/assert.util';
import { CurrencyOrmEntity } from '@src/common/infrastructure/database/typeorm/currency.orm';
import { ReceiptItemId } from '@src/modules/manage/domain/value-objects/receipt-item-id.vo';
import { ReceiptInterface } from '../interface/receipt.interface';
import { UserApprovalOrmEntity } from '@src/common/infrastructure/database/typeorm/user-approval.orm';
import { UserApprovalStepOrmEntity } from '@src/common/infrastructure/database/typeorm/user-approval-step.orm';

interface ReceiptItemInterface {
  id?: number;
  receipt_id: number;
  purchase_order_item_id?: number;
  quantity?: number;
  price?: number;
  total?: number;
  currency_id?: number;
  payment_currency_id: number;
  exchange_rate: number;
  payment_total: number;
  payment_type: EnumPaymentType;
  remark: string;
}

@CommandHandler(UpdateCommand)
export class UpdateCommandHandler
  implements IQueryHandler<UpdateCommand, ResponseResult<ReceiptEntity>>
{
  constructor(
    @Inject(WRITE_RECEIPT_REPOSITORY)
    private readonly _write: IWriteReceiptRepository,
    private readonly _dataMapper: ReceiptDataMapper,
    @Inject(WRITE_RECEIPT_ITEM_REPOSITORY)
    private readonly _writeItem: IWriteReceiptItemRepository,
    private readonly _dataItemMapper: ReceiptItemDataMapper,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
  ) {}
  async execute(query: UpdateCommand): Promise<ReceiptEntity> {
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
        const receipt = await findOneOrFail(query.manager, ReceiptOrmEntity, {
          id: query.id,
        });

        const document_id = (receipt as any).document_id;
        // check user approval step before update
        await this.checkStatusToUpdate(manager, document_id);

        if (query.dto.receipt_items.length > 0) {
          // update item
          await this.updateItem(query, manager);
        }

        const ReceiptEntity = this._dataMapper.toEntity(
          query.dto as ReceiptInterface,
        );

        await ReceiptEntity.initializeUpdateSetId(new ReceiptId(query.id));
        await ReceiptEntity.validateExistingIdForUpdate();
        return ReceiptEntity;
      },
    );
  }

  private async checkCurrency(
    currency: number,
    manager: EntityManager,
  ): Promise<void> {
    await findOneOrFail(manager, CurrencyOrmEntity, {
      id: currency,
    });
  }

  private async getCurrency(
    currency: number,
    manager: EntityManager,
  ): Promise<CurrencyOrmEntity> {
    return await findOneOrFail(manager, CurrencyOrmEntity, {
      id: currency,
    });
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

  private async updateItem(
    query: UpdateCommand,
    manager: EntityManager,
  ): Promise<void> {
    for (const item of query.dto.receipt_items) {
      await this.checkCurrency(item.payment_currency_id, manager);
      const find_currency = await manager.findOne(ReceiptItemOrmEntity, {
        where: {
          id: item.id,
        },
      });

      assertOrThrow(
        find_currency,
        'errors.not_found',
        HttpStatus.NOT_FOUND,
        'currency',
      );

      const exchange_rate = await manager.findOne(ExchangeRateOrmEntity, {
        where: {
          from_currency_id: find_currency?.currency_id,
          to_currency_id: item.payment_currency_id,
          is_active: true,
        },
      });

      assertOrThrow(
        exchange_rate,
        'errors.not_found',
        HttpStatus.NOT_FOUND,
        'exchange rate',
      );

      const currency = await this.getCurrency(
        exchange_rate!.from_currency_id,
        manager,
      );
      const payment_currency = await this.getCurrency(
        exchange_rate!.to_currency_id,
        manager,
      );

      let payment_total = 0;
      const get_total = find_currency?.total ?? 0;
      const rate = exchange_rate?.rate ?? 0;

      if (currency.code === 'USD' && payment_currency.code === 'LAK') {
        payment_total = get_total * rate;
      } else if (currency.code === 'LAK' && payment_currency.code === 'USD') {
        payment_total = get_total / rate;
      } else if (currency.code === 'LAK' && payment_currency.code === 'LAK') {
        payment_total = get_total * rate;
      } else if (currency.code === 'THB' && payment_currency.code === 'LAK') {
        payment_total = get_total * rate;
      } else if (currency.code === 'LAK' && payment_currency.code === 'THB') {
        payment_total = get_total / rate;
      } else if (currency.code === 'THB' && payment_currency.code === 'USD') {
        payment_total = get_total / rate;
      } else if (currency.code === 'USD' && payment_currency.code === 'THB') {
        payment_total = get_total * rate;
      } else if (currency.code === 'USD' && payment_currency.code === 'USD') {
        payment_total = get_total * rate;
      } else if (currency.code === 'THB' && payment_currency.code === 'THB') {
        payment_total = get_total * rate;
      }

      const itemDto: ReceiptItemInterface = {
        id: item.id,
        receipt_id: query.id,
        payment_currency_id: item.payment_currency_id,
        exchange_rate: rate,
        payment_total: payment_total,
        payment_type: item.payment_type,
        remark: item.remark,
      };
      const entity = this._dataItemMapper.toEntity(itemDto);

      // Set and validate ID
      await entity.initializeUpdateSetId(new ReceiptItemId(item.id));
      await entity.validateExistingIdForUpdate();

      // Final existence check for ID before update
      await findOneOrFail(manager, ReceiptItemOrmEntity, {
        id: entity.getId().value,
      });

      await this._writeItem.update(entity, manager);
    }
  }
}
