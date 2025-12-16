import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PAGINATION_SERVICE } from '@src/common/constants/inject-key.const';
import {
  FilterOptions,
  IPaginationService,
  ResponseResult,
} from '@src/common/infrastructure/pagination/pagination.interface';
import { IReadBudgetItemRepository } from '@src/modules/manage/domain/ports/output/budget-item-repository.interace';
import { BudgetItemDataAccessMapper } from '../../mappers/budget-item.mapper';
import { EntityManager } from 'typeorm';
import { BudgetItemQueryDto } from '@src/modules/manage/application/dto/query/budget-item.dto';
import { BudgetItemEntity } from '@src/modules/manage/domain/entities/budget-item.entity';
import { BudgetItemOrmEntity } from '@src/common/infrastructure/database/typeorm/budget-item.orm';
import { BudgetItemId } from '@src/modules/manage/domain/value-objects/budget-item-id.vo';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { EligiblePersons } from '@src/modules/manage/application/constants/status-key.const';

@Injectable()
export class ReadBudgetItemRepository implements IReadBudgetItemRepository {
  constructor(
    private readonly _dataAccessMapper: BudgetItemDataAccessMapper,
    @Inject(PAGINATION_SERVICE)
    private readonly _paginationService: IPaginationService,
  ) {}
  async findAll(
    query: BudgetItemQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<BudgetItemEntity>> {
    const budget_account_id = Number(query.budget_account_id);
    const department_id = Number(query.department_id);
    const year = query.fiscal_year;
    const company_id = Number(query.company_id);
    const queryBuilder = this.createBaseQuery(manager);

    if (budget_account_id) {
      queryBuilder.andWhere(
        'budget_items.budget_account_id = :budget_account_id',
        {
          budget_account_id,
        },
      );
    }

    if (company_id) {
      queryBuilder.andWhere('budget_accounts.company_id = :company_id', {
        company_id,
      });
    }

    if (department_id) {
      queryBuilder.andWhere('departments.id = :department_id', {
        department_id,
      });
    }

    // Assuming 'year' is an input parameter like '2025'
    const yearAsNumber = year ? Number(year) : null;
    console.log('yearAsNumber', year);

    if (yearAsNumber) {
      queryBuilder.andWhere(
        `EXTRACT(YEAR FROM budget_accounts.created_at) = :year`,
        {
          year: yearAsNumber,
        },
      );
    }
    // Ensure sorting
    query.sort_by = 'budget_items.id';

    // Use pagination service
    const data = await this._paginationService.paginate(
      queryBuilder,
      query,
      this._dataAccessMapper.toEntityReport.bind(this._dataAccessMapper),
      this.getFilterOptions(),
    );

    return data;
  }

  private createBaseQuery(manager: EntityManager) {
    const query = manager
      .createQueryBuilder(BudgetItemOrmEntity, 'budget_items')
      .select([
        'budget_items.id',
        'budget_items.name',
        'budget_items.budget_account_id',
        'budget_items.created_at',
        'budget_items.updated_at',
      ])
      .innerJoin('budget_items.budget_accounts', 'budget_accounts')
      .leftJoin('budget_accounts.departments', 'departments')
      .leftJoin('budget_accounts.company', 'company')
      .leftJoin('budget_items.increase_budget_detail', 'increase_budget_detail')
      .leftJoin('budget_items.document_transactions', 'document_transactions')
      .addSelect([
        'budget_accounts.id',
        'budget_accounts.name',
        'budget_accounts.code',
        'budget_accounts.fiscal_year',
        'budget_accounts.department_id',
        'budget_accounts.created_at',
        'budget_accounts.updated_at',
        'departments.id',
        'departments.name',
        'departments.code',
        'departments.department_head_id',
        'departments.created_at',
        'departments.updated_at',
        'increase_budget_detail.id',
        'increase_budget_detail.allocated_amount',
        'document_transactions.id',
        'document_transactions.amount',
        'document_transactions.document_id',
        'document_transactions.transaction_type',
        'document_transactions.budget_item_id',
        'company.id',
        'company.name',
        'company.logo',
        'company.email',
        'company.tel',
      ]);

    // Add a subquery to get the total used amount per budget item to avoid duplication
    // query.addSelect(
    //   (subQuery) =>
    //     subQuery
    //       .select('COALESCE(SUM(document_transactions.amount), 0)')
    //       .from('document_transactions', 'document_transactions')
    //       .where('document_transactions.budget_item_id = budget_items.id'),
    //   'used_amount',
    // );

    // // Add a subquery to get the total allocated amount per budget item
    // query.addSelect(
    //   (subQuery) =>
    //     subQuery
    //       .select('COALESCE(SUM(increase_budget_detail.allocated_amount), 0)')
    //       .from('increase_budget_details', 'increase_budget_detail')
    //       .where('increase_budget_detail.budget_item_id = budget_items.id'),
    //   'allocated_amount_total',
    // );

    // if (budget_account_id) {
    //   query.where('budget_accounts.id = :budget_account_id', {
    //     budget_account_id: budget_account_id,
    //   });
    // }
    return query;
  }

  private getFilterOptions(): FilterOptions {
    return {
      searchColumns: ['budget_items.name', 'budget_items.description'],
      dateColumn: '',
      filterByColumns: [],
    };
  }

  // private async getTotalAllocatedForAccount(
  //   manager: EntityManager,
  //   budget_account_id?: number,
  // ): Promise<number> {
  //   const query = manager
  //     .createQueryBuilder(BudgetItemOrmEntity, 'budget_items')
  //     .leftJoin('budget_accounts.departments', 'departments')
  //     .leftJoin('budget_items.increase_budget_detail', 'increase_budget_detail')
  //     .leftJoin('budget_items.document_transactions', 'document_transactions')
  //     .addSelect([
  //       'increase_budget_detail.allocated_amount',
  //       'document_transactions.amount',
  //       'document_transactions.document_id',
  //       'document_transactions.transaction_type',
  //       'document_transactions.budget_item_id',
  //     ]);

  //     return query.getRawOne();
  // }

  async findOne(
    id: BudgetItemId,
    manager: EntityManager,
  ): Promise<ResponseResult<BudgetItemEntity>> {
    const item = await this.createBaseQuery(manager)
      .where('budget_items.id = :id', { id: id.value })
      .getOneOrFail();

    return this._dataAccessMapper.toEntity(item);
  }

  async report(
    query: BudgetItemQueryDto,
    manager: EntityManager,
    company_id?: number,
    roles?: string[],
    department_id?: number,
  ): Promise<ResponseResult<BudgetItemEntity>> {
    const queryBuilder = await this.createBaseReportQuery(
      manager,
      query,
      company_id,
      roles,
      department_id,
    );
    query.sort_by = 'budget_items.id';

    const data = await this._paginationService.paginate(
      queryBuilder,
      query,
      this._dataAccessMapper.toEntityReport.bind(this._dataAccessMapper),
      this.getReportFilterOptions(),
    );
    return data;
  }

  private createBaseReportQuery(
    manager: EntityManager,
    query?: BudgetItemQueryDto,
    company_id?: number,
    roles?: string[],
    department_id?: number,
  ) {
    const queryBuilder = manager
      .createQueryBuilder(BudgetItemOrmEntity, 'budget_items')
      .select([
        'budget_items.id',
        'budget_items.name',
        'budget_items.budget_account_id',
        'budget_items.created_at',
        'budget_items.updated_at',
      ])
      .innerJoin('budget_items.budget_accounts', 'budget_accounts')
      .leftJoin('budget_accounts.departments', 'departments')
      .leftJoin('budget_items.increase_budget_detail', 'increase_budget_detail')
      .leftJoin('budget_items.document_transactions', 'document_transactions')

      // .leftJoinAndSelect(
      //   'budget_items.increase_budget_detail',
      //   'increase_budget_detail',
      // )
      .addSelect([
        'budget_accounts.id',
        'budget_accounts.name',
        'budget_accounts.code',
        'budget_accounts.fiscal_year',
        'budget_accounts.type',
        'budget_accounts.department_id',
        'budget_accounts.created_at',
        'budget_accounts.updated_at',
        'departments.id',
        'departments.name',
        'departments.code',
        'departments.department_head_id',
        'departments.created_at',
        'departments.updated_at',
        'increase_budget_detail.id',
        'increase_budget_detail.allocated_amount',
        'document_transactions.amount',
        'document_transactions.id',
        'document_transactions.budget_item_id',
      ])
      .groupBy('budget_items.id')
      .addGroupBy('increase_budget_detail.id')
      .addGroupBy('budget_accounts.id')
      .addGroupBy('document_transactions.id')
      .addGroupBy('departments.id');

    if (
      roles &&
      !roles.includes(EligiblePersons.SUPER_ADMIN) &&
      !roles.includes(EligiblePersons.ADMIN)
    ) {
      if (
        roles.includes(EligiblePersons.COMPANY_ADMIN) ||
        roles.includes(EligiblePersons.COMPANY_USER)
      ) {
        if (company_id) {
          queryBuilder.where('budget_accounts.company_id = :company_id', {
            company_id,
          });
        }
      }
      if (department_id) {
        queryBuilder.andWhere(
          'budget_accounts.department_id = :department_id',
          { department_id },
        );
      }
    }

    if (query?.budget_account_id) {
      queryBuilder.where('budget_accounts.id = :budget_account_id', {
        budget_account_id: query.budget_account_id,
      });
    }

    if (query?.type) {
      queryBuilder.where('budget_accounts.type = :type', {
        type: query.type,
      });
    }

    if (query?.department_id) {
      queryBuilder.where('departments.id = :department_id', {
        department_id: query.department_id,
      });
    }
    return queryBuilder;
  }
  private getReportFilterOptions(): FilterOptions {
    return {
      searchColumns: ['budget_items.name'],
      dateColumn: '',
      filterByColumns: [
        // 'budget_accounts.id',
        // 'budget_accounts.type',
        // 'departments.id',
      ],
    };
  }

  async getItemId(
    id: BudgetItemId,
    manager: EntityManager,
  ): Promise<BudgetItemEntity> {
    const item = await manager
      .createQueryBuilder(BudgetItemOrmEntity, 'budget_items')
      .select([
        'budget_items.id',
        'budget_items.name',
        'budget_items.budget_account_id',
        'budget_items.created_at',
        'budget_items.updated_at',
      ])
      .innerJoin('budget_items.budget_accounts', 'budget_accounts')
      .leftJoin('budget_accounts.departments', 'departments')
      .leftJoin('budget_items.increase_budget_detail', 'increase_budget_detail')
      .leftJoin('budget_items.document_transactions', 'document_transactions')
      .addSelect([
        'budget_accounts.id',
        'budget_accounts.name',
        'budget_accounts.code',
        'budget_accounts.fiscal_year',
        'budget_accounts.type',
        'budget_accounts.department_id',
        'budget_accounts.created_at',
        'budget_accounts.updated_at',
        'departments.id',
        'departments.name',
        'departments.code',
        'departments.department_head_id',
        'departments.created_at',
        'departments.updated_at',
        'increase_budget_detail.id',
        'increase_budget_detail.allocated_amount',
        'document_transactions.amount',
        'document_transactions.id',
        'document_transactions.budget_item_id',
      ])
      .where('budget_items.id = :id', { id: id.value })
      .getOne();

    if (!item) {
      throw new ManageDomainException('errors.not_found', HttpStatus.NOT_FOUND);
    }

    return this._dataAccessMapper.toEntityReport(item);
  }

  async calculate(
    id: number,
    manager: EntityManager,
    // company_id?: number,
  ): Promise<number> {
    // Sum amount from document_transactions
    const documentTransactionSum = await manager
      .createQueryBuilder()
      .select('SUM(document_transactions.amount)', 'total')
      .from('document_transactions', 'document_transactions')
      .leftJoin('document_transactions.documents', 'documents')
      .where('document_transactions.budget_item_id = :id', { id })
      // .andWhere('documents.company_id = :company_id', { company_id })
      .getRawOne();

    // Sum allocated_amount from increase_budget_detail
    const increaseBudgetSum = await manager
      .createQueryBuilder()
      .select('SUM(increase_budget_detail.allocated_amount)', 'total')
      .from('increase_budget_details', 'increase_budget_detail')
      .leftJoin('increase_budget_detail.increase_budgets', 'increase_budgets')
      // .leftJoin('increase_budgets.budget_account', 'budget_account')
      .where('increase_budget_detail.budget_item_id = :id', { id })
      // .andWhere('budget_account.company_id = :company_id', { company_id })
      .getRawOne();

    const total =
      Number(increaseBudgetSum.total) - Number(documentTransactionSum.total);

    // Add sums to the result
    return total;
  }

  async getTotal(
    id: number,
    manager: EntityManager,
    // company_id?: number,
  ): Promise<number> {
    const result = await manager
      .createQueryBuilder()
      .select('purchase_order_items.total', 'total')
      .from('purchase_order_items', 'purchase_order_items')
      // .leftJoin('purchase_order_items.quota_company', 'quota_company')
      .where('purchase_order_items.id = :id', { id })
      // .andWhere('quota_company.company_id = :company_id', { company_id })
      .getRawOne();

    if (!result || result.total === null) {
      return 0;
    }

    return Number(result.total);
  }

  async getBudgetItem(
    query: BudgetItemQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<BudgetItemEntity>> {
    const queryBuilder = await this.createBaseQueryBudgetItem(manager, query);
    query.sort_by = 'budget_items.id';

    const data = await this._paginationService.paginate(
      queryBuilder,
      query,
      this._dataAccessMapper.toEntity.bind(this._dataAccessMapper),
      this.getFilterOptions(),
    );
    return data;
  }

  private createBaseQueryBudgetItem(
    manager: EntityManager,
    query: BudgetItemQueryDto,
  ) {
    const queryBuilder = manager
      .createQueryBuilder(BudgetItemOrmEntity, 'budget_items')
      .select([
        'budget_items.id',
        'budget_items.name',
        'budget_items.budget_account_id',
        'budget_items.created_at',
        'budget_items.updated_at',
      ])
      .innerJoin('budget_items.budget_accounts', 'budget_accounts')
      .leftJoin('budget_accounts.departments', 'departments')
      .addSelect([
        'budget_accounts.id',
        'budget_accounts.name',
        'budget_accounts.code',
        'budget_accounts.fiscal_year',
        'budget_accounts.department_id',
        'budget_accounts.created_at',
        'budget_accounts.updated_at',
        'departments.id',
        'departments.name',
        'departments.code',
        'departments.department_head_id',
        'departments.created_at',
        'departments.updated_at',
      ]);

    if (query?.budget_account_id) {
      queryBuilder.where('budget_accounts.id = :budget_account_id', {
        budget_account_id: query.budget_account_id,
      });
    }

    return queryBuilder;
  }
}
