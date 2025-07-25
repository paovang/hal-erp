import { BudgetItemOrmEntity } from '@src/common/infrastructure/database/typeorm/budget-item.orm';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { BudgetItemEntity } from '../../domain/entities/budget-item.entity';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { BudgetItemId } from '../../domain/value-objects/budget-item-id.vo';
import { Injectable } from '@nestjs/common';
import { BudgetItemDetailDataAccessMapper } from './budget-item-detail.mapper';
import { BudgetItemDetailEntity } from '../../domain/entities/budget-item-detail.entity';
import { BudgetAccountDataAccessMapper } from './budget-account.mapper';

// interface BudgetItemOrmEntityWithCount extends BudgetItemOrmEntity {
//   details_count?: number | null;
// }

// type BudgetItemOrmEntityWithCount = BudgetItemOrmEntity & {
//   details_count?: number | null;
// };

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
    mediaOrmEntity.allocated_amount = budgetItemEntity.allocatedAmount;
    mediaOrmEntity.name = budgetItemEntity.name;
    if (method === OrmEntityMethod.CREATE) {
      mediaOrmEntity.created_at = budgetItemEntity.createdAt ?? new Date(now);
    }
    mediaOrmEntity.updated_at = new Date(now);

    return mediaOrmEntity;
  }

  // toEntity(ormData: BudgetItemOrmEntityWithCount): BudgetItemEntity {
  toEntity(row: any): BudgetItemEntity {
    console.log('object', row.details_count);

    const builder = BudgetItemEntity.builder()
      .setBudgetItemId(new BudgetItemId(row.id))
      .setName(row.name ?? '')
      .setBudgetAccountId(row.budget_account_id ?? 0)
      .setAllocatedAmount(row.allocated_amount ?? 0)
      .setCreatedAt(row.created_at)
      .setUpdatedAt(row.updated_at)
      .setCountDetails(row.details_count ?? 0);
    if (row.budget_accounts) {
      builder.setBudgetAccount(
        this.budgetAccount.toEntity(row.budget_accounts),
      );
    }

    if (Array.isArray(row.budget_item_details)) {
      const transformedDetails: BudgetItemDetailEntity[] = [];

      for (const detail of row.budget_item_details) {
        transformedDetails.push(this.details.toEntity(detail));
      }

      builder.setDetails(transformedDetails);
    }

    return builder.build();
  }
}
