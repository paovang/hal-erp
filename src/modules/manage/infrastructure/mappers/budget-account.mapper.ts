import { Injectable } from '@nestjs/common';
import { BudgetAccountEntity } from '../../domain/entities/budget-account.entity';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { BudgetAccountOrmEntity } from '@src/common/infrastructure/database/typeorm/budget-account.orm';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import moment from 'moment-timezone';
import { BudgetAccountId } from '../../domain/value-objects/budget-account-id.vo';
import { DepartmentDataAccessMapper } from './department.mapper';
import { EnumBudgetType } from '../../application/constants/status-key.const';

@Injectable()
export class BudgetAccountDataAccessMapper {
  constructor(private readonly departmentMapper: DepartmentDataAccessMapper) {}
  toOrmEntity(
    budgetAccountEntity: BudgetAccountEntity,
    method: OrmEntityMethod,
  ): BudgetAccountOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);
    const id = budgetAccountEntity.getId();

    const mediaOrmEntity = new BudgetAccountOrmEntity();
    if (id) {
      mediaOrmEntity.id = id.value;
    }

    mediaOrmEntity.code = budgetAccountEntity.code;
    mediaOrmEntity.name = budgetAccountEntity.name;
    mediaOrmEntity.fiscal_year = budgetAccountEntity.fiscal_year;
    // mediaOrmEntity.allocated_amount = budgetAccountEntity.allocated_amount;
    mediaOrmEntity.department_id = budgetAccountEntity.departmentId;
    mediaOrmEntity.type = budgetAccountEntity.type;
    if (method === OrmEntityMethod.CREATE) {
      mediaOrmEntity.created_at =
        budgetAccountEntity.createdAt ?? new Date(now);
    }
    mediaOrmEntity.updated_at = new Date(now);

    return mediaOrmEntity;
  }

  toEntity(
    ormData: BudgetAccountOrmEntity & {
      allocated_amount_total?: string;
      used_amount?: string;
      increase_amount?: string;
    },
  ): BudgetAccountEntity {
    const allocated_amount = Array.isArray(ormData.increase_budgets)
      ? ormData.increase_budgets.reduce(
          (sum, increase) => sum + Number(increase.allocated_amount ?? 0),
          0,
        )
      : 0;

    const increase_amount = (ormData.budget_items ?? [])
      .flatMap((item) => item.increase_budget_detail ?? [])
      .reduce((sum, d) => sum + (d.allocated_amount ?? 0), 0);

    const totalUsedAmount = (ormData.budget_items ?? [])
      .flatMap((item) => item.document_transactions ?? [])
      .reduce((sum, d) => sum + (d.amount ?? 0), 0);

    // const allocated_amount = Number(ormData.allocated_amount_total ?? 0);
    // const totalUsedAmount = Number(ormData.used_amount ?? 0);
    // const increase_amount = Number(ormData.increase_amount ?? 0);
    console.log('totalAllocated', allocated_amount);
    console.log('totalUsedAmount', totalUsedAmount);
    console.log('increase_amount', increase_amount);

    const total_budget = allocated_amount - increase_amount;
    const balance_amount = increase_amount - totalUsedAmount;

    const build = BudgetAccountEntity.builder()
      .setBudgetAccountId(new BudgetAccountId(ormData.id))
      .setCode(ormData.code ?? '')
      .setName(ormData.name ?? '')
      .setFiscalYear(ormData.fiscal_year ?? 0)
      .setAllocatedAmount(allocated_amount)
      .setTotalBudget(total_budget)
      .setIncreaseAmount(increase_amount)
      .setUsedAmount(totalUsedAmount)
      .setBalanceAmount(balance_amount)
      .setType(ormData.type ?? EnumBudgetType.EXPENDITURE)
      .setDepartmentId(ormData.department_id ?? 0)
      .setCreatedAt(ormData.created_at)
      .setUpdatedAt(ormData.updated_at);

    if (ormData.departments) {
      build.setDepartment(this.departmentMapper.toEntity(ormData.departments));
    }

    // Add these lines
    // if ('sumAdd' in ormData) {
    //   build.setSumAdd(Number(ormData.sumAdd) || 0);
    // }
    // if ('sumSpend' in ormData) {
    //   build.setSumSpend(Number(ormData.sumSpend) || 0);
    // }

    return build.build();
  }
}
