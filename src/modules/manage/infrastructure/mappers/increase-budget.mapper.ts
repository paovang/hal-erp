import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { IncreaseBudgetEntity } from '../../domain/entities/increase-budget.entity';
import { IncreaseBudgetOrmEntity } from '@src/common/infrastructure/database/typeorm/increase-budget.orm';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import moment from 'moment-timezone';
import { IncreaseBudgetId } from '../../domain/value-objects/increase-budget-id.vo';
import { Injectable } from '@nestjs/common';
import { BudgetAccountDataAccessMapper } from './budget-account.mapper';
import { IncreaseBudgetFileDataAccessMapper } from './increase-budget-file.mapper';
import { UserDataAccessMapper } from './user.mapper';
import { IncreaseBudgetDetailDataAccessMapper } from './increase-budget-detail.mapper';

@Injectable()
export class IncreaseBudgetDataAccessMapper {
  constructor(
    private readonly _budget_account: BudgetAccountDataAccessMapper,
    private readonly _budget_file: IncreaseBudgetFileDataAccessMapper,
    private readonly _create_by: UserDataAccessMapper,
    private readonly _detail: IncreaseBudgetDetailDataAccessMapper,
  ) {}
  toOrmEntity(
    entity: IncreaseBudgetEntity,
    method: OrmEntityMethod,
  ): IncreaseBudgetOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);
    const id = entity.getId();

    const mediaOrmEntity = new IncreaseBudgetOrmEntity();
    if (id) {
      mediaOrmEntity.id = id.value;
    }

    mediaOrmEntity.budget_account_id = entity.budget_account_id;
    mediaOrmEntity.allocated_amount = entity.allocated_amount;
    mediaOrmEntity.description = entity.description ?? '';
    mediaOrmEntity.import_date = entity.import_date ?? new Date(now);
    mediaOrmEntity.created_by = entity.created_by;
    if (method === OrmEntityMethod.CREATE) {
      mediaOrmEntity.created_at = entity.createdAt ?? new Date(now);
    }
    mediaOrmEntity.updated_at = new Date(now);

    return mediaOrmEntity;
  }

  toEntity(ormData: IncreaseBudgetOrmEntity): IncreaseBudgetEntity {
    const builder = IncreaseBudgetEntity.builder()
      .setIncreaseBudgetId(new IncreaseBudgetId(ormData.id))
      .setBudgetAccountId(ormData.budget_account_id ?? 0)
      .setAllocatedAmount(ormData.allocated_amount ?? 0)
      .setDescription(ormData.description ?? '')
      .setImportDate(ormData.import_date ?? null)
      .setCreatedBy(ormData.created_by ?? 0)
      .setCreatedAt(ormData.created_at)
      .setUpdatedAt(ormData.updated_at);

    if (ormData.budget_account) {
      builder.setBudgetAccount(
        this._budget_account.toEntity(ormData.budget_account),
      );
    }

    if (ormData.users) {
      builder.setCreatedByUser(this._create_by.toEntity(ormData.users));
    }

    if (ormData.increase_budget_files) {
      const increaseBudgetFiles = ormData.increase_budget_files.map((file) =>
        this._budget_file.toEntity(file),
      );
      builder.setIncreaseBudgetFile(increaseBudgetFiles);
    }

    if (ormData.increase_budget_details) {
      const increaseBudgetDetails = ormData.increase_budget_details.map(
        (detail) => this._detail.toEntity(detail),
      );
      builder.setDetails(increaseBudgetDetails);
    }

    return builder.build();
  }
}
