import { BudgetItemOrmEntity } from '@src/common/infrastructure/database/typeorm/budget-item.orm';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { BudgetItemEntity } from '../../domain/entities/budget-item.entity';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { BudgetItemId } from '../../domain/value-objects/budget-item-id.vo';
import { Injectable } from '@nestjs/common';
import { BudgetItemDetailDataAccessMapper } from './budget-item-detail.mapper';
import { BudgetAccountDataAccessMapper } from './budget-account.mapper';

@Injectable()
export class BudgetItemDataAccessMapper {
  constructor(
    private readonly details: BudgetItemDetailDataAccessMapper,
    private readonly budgetAccount: BudgetAccountDataAccessMapper,
  ) {}
  toOrmEntity(
    budgetItemEntity: BudgetItemEntity,
    method: OrmEntityMethod,
  ): BudgetItemOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);
    const id = budgetItemEntity.getId();

    const mediaOrmEntity = new BudgetItemOrmEntity();
    if (id) {
      mediaOrmEntity.id = id.value;
    }
    mediaOrmEntity.budget_account_id = budgetItemEntity.budgetAccountId;
    mediaOrmEntity.description = budgetItemEntity.description ?? '';
    mediaOrmEntity.name = budgetItemEntity.name;
    if (method === OrmEntityMethod.CREATE) {
      mediaOrmEntity.created_at = budgetItemEntity.createdAt ?? new Date(now);
    }
    mediaOrmEntity.updated_at = new Date(now);

    return mediaOrmEntity;
  }

  toEntity(row: BudgetItemOrmEntity): BudgetItemEntity {
    const totalAllocated = Array.isArray(row.increase_budget_detail)
      ? row.increase_budget_detail.reduce(
          (sum, detail) => sum + Number(detail.allocated_amount ?? 0),
          0,
        )
      : 0;

    const totalUsedAmount = Array.isArray(row.document_transactions)
      ? row.document_transactions.reduce(
          (sum, transaction) => sum + Number(transaction.amount ?? 0),
          0,
        )
      : 0;

    const balance = totalAllocated - totalUsedAmount;

    const builder = BudgetItemEntity.builder()
      .setBudgetItemId(new BudgetItemId(row.id))
      .setName(row.name ?? '')
      .setBudgetAccountId(row.budget_account_id ?? 0)
      .setAllocatedAmount(totalAllocated)
      .setUsedAmount(totalUsedAmount)
      .setBalance(balance)
      .setDescription(row.description ?? '')
      .setCreatedAt(row.created_at)
      .setUpdatedAt(row.updated_at);

    if (row.budget_accounts) {
      builder.setBudgetAccount(
        this.budgetAccount.toEntity(row.budget_accounts),
      );
    }

    return builder.build();
  }
}
