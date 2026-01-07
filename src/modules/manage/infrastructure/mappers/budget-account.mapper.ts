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
import { CompanyDataAccessMapper } from './company.mapper';
import { CompanyOrmEntity } from '@src/common/infrastructure/database/typeorm/company.orm';
import { ReportBudgetInterface } from '@src/common/application/interfaces/report-budget.interface';

@Injectable()
export class BudgetAccountDataAccessMapper {
  constructor(
    private readonly departmentMapper: DepartmentDataAccessMapper,
    private readonly company: CompanyDataAccessMapper,
  ) {}
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
    mediaOrmEntity.allocated_amount = budgetAccountEntity.allocated_amount;
    mediaOrmEntity.department_id = budgetAccountEntity.departmentId;
    mediaOrmEntity.company_id = budgetAccountEntity.company_id;
    mediaOrmEntity.type = budgetAccountEntity.type;
    if (method === OrmEntityMethod.CREATE) {
      mediaOrmEntity.created_at =
        budgetAccountEntity.createdAt ?? new Date(now);
    }
    mediaOrmEntity.updated_at = new Date(now);

    return mediaOrmEntity;
  }

  toEntity(ormData: BudgetAccountOrmEntity): BudgetAccountEntity {
    let total: number; // test
    let balance_amount: number;

    const allocated_amount = Number(ormData.allocated_amount) ?? 0;
    // const increase_allocated_amount =
    //   Array.isArray(ormData.increase_budgets) &&
    //   ormData.increase_budgets.length > 0
    //     ? Number(ormData.increase_budgets[0].allocated_amount ?? 0)
    //     : 0;

    const increase_amount = (ormData.budget_items ?? [])
      .flatMap((item) => item.increase_budget_detail ?? [])
      .reduce((sum, d) => sum + Number(d.allocated_amount ?? 0), 0);
    console.log('increase_amount', increase_amount);

    const totalUsedAmount = (ormData.budget_items ?? [])
      .flatMap((item) => item.document_transactions ?? [])
      .reduce((sum, d) => sum + Number(d.amount ?? 0), 0);

    const total_budget = allocated_amount - increase_amount;
    if (total_budget > 0) {
      total = 0;
    } else {
      total = total_budget;
    }

    if (increase_amount > totalUsedAmount) {
      balance_amount = increase_amount - totalUsedAmount;
    } else {
      balance_amount = increase_amount - totalUsedAmount;
    }
    // const balance_amount = increase_amount;

    const build = BudgetAccountEntity.builder()
      .setBudgetAccountId(new BudgetAccountId(ormData.id))
      .setCode(ormData.code ?? '')
      .setName(ormData.name ?? '')
      .setFiscalYear(ormData.fiscal_year ?? 0)
      .setAllocatedAmount(allocated_amount)
      .setTotalBudget(total)
      // .setTotalBudget(total_budget)
      .setIncreaseAmount(increase_amount)
      .setUsedAmount(totalUsedAmount)
      .setBalanceAmount(balance_amount)
      .setType(ormData.type ?? EnumBudgetType.EXPENDITURE)
      .setDepartmentId(ormData.department_id ?? 0)
      .setCompanyId(ormData.company_id ?? 0)
      .setCreatedAt(ormData.created_at)
      .setUpdatedAt(ormData.updated_at);

    if (ormData.departments) {
      build.setDepartment(this.departmentMapper.toEntity(ormData.departments));
    }

    if (ormData.company) {
      build.setCompany(this.company.toEntity(ormData.company));
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

  /**
   * Calculate company report budget from ORM entities
   * Uses the SAME calculation logic as toEntity() for consistency
   */
  calculateCompanyReportBudget(
    companies: CompanyOrmEntity[],
  ): ReportBudgetInterface {
    const reportData: ReportBudgetInterface = {
      budget_overruns: {
        amount: 0,
        total: 0,
        budget: [],
      },
      within_budget: {
        amount: 0,
        total: 0,
        budget: [],
      },
    };

    for (const company of companies) {
      // Aggregate from all budget_accounts using the same logic as toEntity()
      let increase_amount = 0;
      let used_amount = 0;

      for (const ba of company.budget_accounts ?? []) {
        // Same calculation as toEntity() line 58-60
        const ba_increase = (ba.budget_items ?? [])
          .flatMap((item) => item.increase_budget_detail ?? [])
          .reduce((sum, d) => sum + Number(d.allocated_amount ?? 0), 0);
        increase_amount += ba_increase;

        // Same calculation as toEntity() line 63-65
        const ba_used = (ba.budget_items ?? [])
          .flatMap((item) => item.document_transactions ?? [])
          .reduce((sum, d) => sum + Number(d.amount ?? 0), 0);
        used_amount += ba_used;
      }

      console.log('increase_amount from mapper', increase_amount);

      const remainingAmount = increase_amount - used_amount;

      const logo_url = company.logo
        ? `${process.env.AWS_CLOUDFRONT_DISTRIBUTION_DOMAIN_NAME}/${company.logo}`
        : '';

      const companyReport = {
        id: company.id,
        name: company.name ?? '',
        logo: logo_url,
        allocated_amount: increase_amount,
        total:
          remainingAmount < 0 ? Math.abs(remainingAmount) : remainingAmount,
      };

      if (remainingAmount < 0) {
        // Budget overrun
        reportData.budget_overruns.amount += 1;
        reportData.budget_overruns.total += Math.abs(remainingAmount);
        reportData.budget_overruns.budget.push(companyReport);
      } else {
        // Within budget
        reportData.within_budget.amount += 1;
        reportData.within_budget.total += remainingAmount;
        reportData.within_budget.budget.push(companyReport);
      }
    }

    return reportData;
  }
}
