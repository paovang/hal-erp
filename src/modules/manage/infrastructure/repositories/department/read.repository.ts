import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DepartmentOrmEntity } from '@src/common/infrastructure/database/typeorm/department.orm';
import { IReadDepartmentRepository } from '@src/modules/manage/domain/ports/output/department-repository.interface';
import { DepartmentDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/department.mapper';
import { DepartmentQueryDto } from '@src/modules/manage/application/dto/query/department-query.dto';
import {
  FilterOptions,
  IPaginationService,
  ResponseResult,
} from '@common/infrastructure/pagination/pagination.interface';
import { PAGINATION_SERVICE } from '@src/common/constants/inject-key.const';
import { EntityManager } from 'typeorm';
import { DepartmentEntity } from '@src/modules/manage/domain/entities/department.entity';
import { DepartmentId } from '@src/modules/manage/domain/value-objects/department-id.vo';
import { EligiblePersons } from '@src/modules/manage/application/constants/status-key.const';
import { ReportDepartmentBudget } from '@src/common/application/interfaces/report-department-budget.interface';

@Injectable()
export class ReadDepartmentRepository implements IReadDepartmentRepository {
  constructor(
    private readonly _dataAccessMapper: DepartmentDataAccessMapper,
    @Inject(PAGINATION_SERVICE)
    private readonly _paginationService: IPaginationService,
  ) {}

  async findAll(
    query: DepartmentQueryDto,
    manager: EntityManager,
    company_id?: number,
    roles?: string[],
  ): Promise<ResponseResult<DepartmentEntity>> {
    const queryBuilder = await this.createBaseQuery(manager);
    query.sort_by = 'departments.id';

    if (
      roles &&
      !roles.includes(EligiblePersons.SUPER_ADMIN) &&
      !roles.includes(EligiblePersons.ADMIN)
    ) {
      if (company_id) {
        queryBuilder.where('departments.company_id = :company_id', {
          company_id,
        });
      }
    }

    const data = await this._paginationService.paginate(
      queryBuilder,
      query,
      this._dataAccessMapper.toEntity.bind(this._dataAccessMapper),
      this.getFilterOptions(),
    );
    if (!data) {
      throw new NotFoundException('No departments found.');
    }
    return data;
  }

  async findOne(
    id: DepartmentId,
    manager: EntityManager,
  ): Promise<ResponseResult<DepartmentEntity>> {
    // const item = await findOneOrFail(manager, DepartmentOrmEntity, {
    //   id: id.value,
    // });

    const item = await this.createBaseQuery(manager)
      .where('departments.id = :id', { id: id.value })
      .getOneOrFail();

    return this._dataAccessMapper.toEntity(item);
  }

  private createBaseQuery(manager: EntityManager) {
    return manager
      .createQueryBuilder(DepartmentOrmEntity, 'departments')
      .leftJoinAndSelect('departments.company', 'company')
      .leftJoinAndSelect('departments.users', 'users');
  }

  private getFilterOptions(): FilterOptions {
    return {
      searchColumns: ['departments.code', 'departments.name'],
      dateColumn: '',
      filterByColumns: [],
    };
  }

  // async getReport(
  //   query: DepartmentQueryDto,
  //   manager: EntityManager,
  // ): Promise<ReportDepartmentBudget[]> {
  //   // --- 1. Construct Date Filter ---
  //   let filterMonthDate: string | null = null;

  //   const month = Number(query.month);
  //   if (!isNaN(month) && month >= 1 && month <= 12) {
  //     const targetYear = query.year || new Date().getFullYear();
  //     const monthString = String(month).padStart(2, '0');
  //     filterMonthDate = `${targetYear}-${monthString}-01`;
  //   }

  //   // --- 2. Base Query ---
  //   const reportQuery = manager
  //     .createQueryBuilder(DepartmentOrmEntity, 'departments')
  //     .leftJoin('departments.company', 'company')
  //     .leftJoin('departments.budget_accounts', 'budget_accounts')
  //     .where('departments.company_id = :company_id', {
  //       company_id: query.company_id,
  //     })

  //     // Department fields
  //     .addSelect('departments.id', 'id')
  //     .addSelect('departments.name', 'name')

  //     .addSelect(
  //       `
  // (
  //   SELECT COALESCE(SUM(ib.allocated_amount), 0)
  //   FROM increase_budgets ib
  //   WHERE ib.budget_account_id IN (
  //     SELECT ba.id
  //     FROM budget_accounts ba
  //     WHERE ba.department_id = departments.id
  //   )
  //   ${query.year ? 'AND EXTRACT(YEAR FROM ib.created_at) = :fiscal_year' : ''}
  //   ${filterMonthDate ? "AND DATE_TRUNC('month', ib.created_at) = DATE_TRUNC('month', :month)" : ''}
  // )
  // `,
  //       'allocated_total',
  //     )
  //     .addSelect(
  //       `
  // (
  //   SELECT COALESCE(SUM(dt.amount), 0)
  //   FROM document_transactions dt
  //   WHERE dt.budget_item_id IN (
  //     SELECT bi.id
  //     FROM budget_items bi
  //     WHERE bi.budget_account_id IN (
  //       SELECT ba.id
  //       FROM budget_accounts ba
  //       WHERE ba.department_id = departments.id
  //     )
  //   )
  //   ${query.year ? 'AND EXTRACT(YEAR FROM dt.created_at) = :fiscal_year' : ''}
  //   ${filterMonthDate ? "AND DATE_TRUNC('month', dt.created_at) = DATE_TRUNC('month', :month)" : ''}
  // )
  // `,
  //       'use_total',
  //     )

  //     // Group by department
  //     .groupBy('departments.id')
  //     .addGroupBy('departments.name')
  //     .addGroupBy('company.id')

  //     // Order (must use the alias created above)
  //     .orderBy('use_total', 'DESC')

  //     // Limit top 3 departments
  //     .limit(3);

  //   // --- 3. Parameters ---
  //   if (query.year) {
  //     reportQuery.setParameter('fiscal_year', query.year);
  //   }
  //   if (filterMonthDate) {
  //     reportQuery.setParameter('month', filterMonthDate);
  //   }

  //   // --- 4. Execute ---
  //   const rawData = await reportQuery.getRawMany();

  //   // --- 5. Map Output ---
  //   return rawData.map((row) => ({
  //     id: Number(row.id),
  //     name: row.name,
  //     allocated_total: Number(row.allocated_total) || 0,
  //     use_total: Number(row.use_total) || 0,
  //   }));
  // }

  async getReport(
    query: DepartmentQueryDto,
    manager: EntityManager,
  ): Promise<ReportDepartmentBudget[]> {
    // --- 1. Construct Date Filter ---
    let filterMonthDate: string | null = null;

    // Convert month safely
    const monthNumber = Number(query.month);

    if (!isNaN(monthNumber) && monthNumber >= 1 && monthNumber <= 12) {
      const targetYear = query.year || new Date().getFullYear();
      const monthString = String(monthNumber).padStart(2, '0');
      filterMonthDate = `${targetYear}-${monthString}-01`; // YYYY-MM-DD
    }

    // --- Subquery for allocated_total (reused in HAVING) ---
    const allocatedSubquery = `
    (
      SELECT COALESCE(SUM(ib.allocated_amount), 0)
      FROM increase_budgets ib
      WHERE ib.budget_account_id IN (
        SELECT ba.id FROM budget_accounts ba WHERE ba.department_id = departments.id
      )
      ${query.year ? 'AND EXTRACT(YEAR FROM ib.created_at) = :fiscal_year' : ''}
      ${filterMonthDate ? "AND DATE_TRUNC('month', ib.created_at) = DATE_TRUNC('month', :month::date)" : ''}
    )
  `;

    // --- Subquery for use_total (reused in HAVING) ---
    const usedSubquery = `
    (
      SELECT COALESCE(SUM(dt.amount), 0)
      FROM document_transactions dt
      WHERE dt.budget_item_id IN (
        SELECT bi.id 
        FROM budget_items bi 
        WHERE bi.budget_account_id IN (
          SELECT ba.id FROM budget_accounts ba WHERE ba.department_id = departments.id
        )
      )
      ${query.year ? 'AND EXTRACT(YEAR FROM dt.created_at) = :fiscal_year' : ''}
      ${filterMonthDate ? "AND DATE_TRUNC('month', dt.created_at) = DATE_TRUNC('month', :month::date)" : ''}
    )
  `;

    // --- 2. Base Query ---
    const reportQuery = manager
      .createQueryBuilder(DepartmentOrmEntity, 'departments')
      .leftJoin('departments.company', 'company')
      .where('departments.company_id = :company_id', {
        company_id: query.company_id,
      })

      // Department identity
      .addSelect('departments.id', 'id')
      .addSelect('departments.name', 'name')

      // Allocated and used total
      .addSelect(allocatedSubquery, 'allocated_total')
      .addSelect(usedSubquery, 'use_total')

      // --- 5. Grouping ---
      .groupBy('departments.id')
      .addGroupBy('departments.name')
      .addGroupBy('company.id')

      // --- 6. HAVING (use full subquery, NOT aliases) ---
      .having(
        `
      ${allocatedSubquery} > 0
      OR
      ${usedSubquery} > 0
    `,
      )

      // --- 7. Sort and Limit ---
      .orderBy('use_total', 'DESC')
      .limit(3);

    // --- 8. Set Parameters ---
    if (query.year) {
      reportQuery.setParameter('fiscal_year', query.year);
    }

    if (filterMonthDate) {
      reportQuery.setParameter('month', filterMonthDate);
    }

    // --- 9. Execute Query ---
    const rawData = await reportQuery.getRawMany();

    // --- 10. Map Output ---
    return rawData.map((row) => ({
      id: Number(row.id),
      name: row.name,
      allocated_total: Number(row.allocated_total) || 0,
      use_total: Number(row.use_total) || 0,
    }));
  }
}
