import { Inject, Injectable } from '@nestjs/common';
import { IReadBudgetAccountRepository } from '@src/modules/manage/domain/ports/output/budget-account-repository.interface';
import { BudgetAccountDataAccessMapper } from '../../mappers/budget-account.mapper';
import { PAGINATION_SERVICE } from '@src/common/constants/inject-key.const';
import {
  FilterOptions,
  IPaginationService,
  ResponseResult,
} from '@src/common/infrastructure/pagination/pagination.interface';
import { BudgetAccountQueryDto } from '@src/modules/manage/application/dto/query/budget-account.dto';
import { EntityManager } from 'typeorm';
import { BudgetAccountEntity } from '@src/modules/manage/domain/entities/budget-account.entity';
import { BudgetAccountOrmEntity } from '@src/common/infrastructure/database/typeorm/budget-account.orm';
import { BudgetAccountId } from '@src/modules/manage/domain/value-objects/budget-account-id.vo';
import { DepartmentId } from '@src/modules/manage/domain/value-objects/department-id.vo';
import {
  selectBudgetAccounts,
  selectBudgetItemDetails,
  selectBudgetItems,
  selectDepartments,
} from '@src/common/constants/select-field';

@Injectable()
export class ReadBudgetAccountRepository
  implements IReadBudgetAccountRepository
{
  constructor(
    private readonly _dataAccessMapper: BudgetAccountDataAccessMapper,
    @Inject(PAGINATION_SERVICE)
    private readonly _paginationService: IPaginationService,
  ) {}

  async findAll(
    query: BudgetAccountQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<BudgetAccountEntity>> {
    const queryBuilder = await this.createBaseQuery(manager);
    query.sort_by = 'budget_accounts.id';

    const data = await this._paginationService.paginate(
      queryBuilder,
      query,
      this._dataAccessMapper.toEntity.bind(this._dataAccessMapper),
      this.getFilterOptions(),
    );
    return data;
  }

  private createBaseQuery(manager: EntityManager) {
    return manager
      .createQueryBuilder(BudgetAccountOrmEntity, 'budget_accounts')
      .leftJoinAndSelect('budget_accounts.departments', 'departments');
  }

  private getFilterOptions(): FilterOptions {
    return {
      searchColumns: [
        'budget_accounts.name',
        'budget_accounts.code',
        'departments.name',
      ],
      dateColumn: '',
      filterByColumns: ['budget_accounts.fiscal_year'],
    };
  }

  async findOne(
    id: BudgetAccountId,
    manager: EntityManager,
  ): Promise<ResponseResult<BudgetAccountEntity>> {
    const item = await this.createBaseQuery(manager)
      .where('budget_accounts.id = :id', { id: id.value })
      .getOneOrFail();

    return this._dataAccessMapper.toEntity(item);
  }

  async report(
    id: DepartmentId,
    dto: BudgetAccountQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<BudgetAccountEntity>> {
    const queryBuilder = await this.createReportQuery(manager, id);
    const data = await this._paginationService.paginate(
      queryBuilder,
      dto,
      this._dataAccessMapper.toEntity.bind(this._dataAccessMapper),
      this.getReportFilterOptions(),
    );
    return data;
  }

  private createReportQuery(manager: EntityManager, id: DepartmentId) {
    const selectFields = [
      ...selectDepartments,
      ...selectBudgetAccounts,
      ...selectBudgetItemDetails,
      ...selectBudgetItems,
    ];
    return manager
      .createQueryBuilder(BudgetAccountOrmEntity, 'budget_accounts')
      .leftJoin('budget_accounts.departments', 'departments')
      .leftJoin('budget_accounts.budget_items', 'budget_items')
      .leftJoin('budget_items.budget_item_details', 'budget_item_details')
      .where('departments.id = :id', { id: id.value })
      .addSelect(selectFields);
  }

  private getReportFilterOptions(): FilterOptions {
    return {
      searchColumns: ['budget_accounts.name', 'budget_accounts.code'],
      dateColumn: '',
      filterByColumns: [],
    };
  }
}
