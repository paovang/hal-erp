import { Inject, Injectable } from '@nestjs/common';
import { IReadBudgetApprovalRuleRepository } from '@src/modules/manage/domain/ports/output/budget-approval-rule.interface';
import { BudgetApprovalRuleDataAccessMapper } from '../../mappers/budget-approval-rule.mapper';
import {
  FilterOptions,
  IPaginationService,
  ResponseResult,
} from '@src/common/infrastructure/pagination/pagination.interface';
import { PAGINATION_SERVICE } from '@src/common/constants/inject-key.const';
import { EntityManager } from 'typeorm';
import { BudgetApprovalRuleQueryDto } from '@src/modules/manage/application/dto/query/budget-approval-rule.dto';
import { BudgetApprovalRuleEntity } from '@src/modules/manage/domain/entities/budget-approval-rule.entity';
import { BudgetApprovalRuleOrmEntity } from '@src/common/infrastructure/database/typeorm/budget-approval-rule.orm';
import { BudgetApprovalRuleId } from '@src/modules/manage/domain/value-objects/budget-approval-rule-id.vo';

@Injectable()
export class ReadBudgetApprovalRuleRepository
  implements IReadBudgetApprovalRuleRepository
{
  constructor(
    private readonly _dataAccessMapper: BudgetApprovalRuleDataAccessMapper,
    @Inject(PAGINATION_SERVICE)
    private readonly _paginationService: IPaginationService,
  ) {}

  async findAll(
    query: BudgetApprovalRuleQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<BudgetApprovalRuleEntity>> {
    const queryBuilder = await this.createBaseQuery(manager);
    query.sort_by = 'budget_approval_rules.id';

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
      .createQueryBuilder(BudgetApprovalRuleOrmEntity, 'budget_approval_rules')
      .leftJoinAndSelect('budget_approval_rules.departments', 'departments')
      .leftJoinAndSelect('budget_approval_rules.users', 'users');
  }

  private getFilterOptions(): FilterOptions {
    return {
      searchColumns: [
        'users.username',
        'users.email',
        'users.tel',
        'departments.name',
      ],
      dateColumn: '',
      filterByColumns: [],
    };
  }

  async findOne(
    id: BudgetApprovalRuleId,
    manager: EntityManager,
  ): Promise<ResponseResult<BudgetApprovalRuleEntity>> {
    const item = await this.createBaseQuery(manager)
      .where('budget_approval_rules.id = :id', { id: id.value })
      .getOneOrFail();

    return this._dataAccessMapper.toEntity(item);
  }
}
