import { Inject, Injectable } from '@nestjs/common';
import { CompanyOrmEntity } from '@src/common/infrastructure/database/typeorm/company.orm';
import { IReadCompanyRepository } from '@src/modules/manage/domain/ports/output/company-repository.interface';
import { CompanyDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/company.mapper';
import { CompanyQueryDto } from '@src/modules/manage/application/dto/query/company-query.dto';
import {
  FilterOptions,
  IPaginationService,
  ResponseResult,
} from '@common/infrastructure/pagination/pagination.interface';
import { PAGINATION_SERVICE } from '@src/common/constants/inject-key.const';
import { EntityManager, Repository } from 'typeorm';
import { CompanyEntity } from '@src/modules/manage/domain/entities/company.entity';
import { CompanyId } from '@src/modules/manage/domain/value-objects/company-id.vo';
import { EligiblePersons } from '@src/modules/manage/application/constants/status-key.const';
import { InjectRepository } from '@nestjs/typeorm';
import { ReportCompanyInterface } from '@src/common/application/interfaces/report-company.intergace';

@Injectable()
export class ReadCompanyRepository implements IReadCompanyRepository {
  constructor(
    private readonly _dataAccessMapper: CompanyDataAccessMapper,
    @Inject(PAGINATION_SERVICE)
    private readonly _paginationService: IPaginationService,
    @InjectRepository(CompanyOrmEntity)
    private readonly _companyRepository: Repository<CompanyOrmEntity>,
  ) {}

  async findAll(
    query: CompanyQueryDto,
    manager: EntityManager,
    company_id?: number,
    roles?: string[],
    department_id?: number,
  ): Promise<ResponseResult<CompanyEntity>> {
    const queryBuilder = await this.createBaseQuery(manager);
    query.sort_by = 'companies.id';

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
          queryBuilder.where('companies.id = :company_id', {
            company_id,
          });
        }
        if (department_id) {
          queryBuilder.andWhere('departments.id = :department_id', {
            department_id,
          });
        }
      }
      if (department_id) {
        queryBuilder.andWhere('departments.id = :department_id', {
          department_id,
        });
      }
    }

    const data = await this._paginationService.paginate(
      queryBuilder,
      query,
      this._dataAccessMapper.toEntity.bind(this._dataAccessMapper),
      this.getFilterOptions(),
    );
    return data as ResponseResult<CompanyEntity>;
  }

  async findOne(
    id: CompanyId,
    manager: EntityManager,
  ): Promise<ResponseResult<CompanyEntity>> {
    const item = await this.createBaseQuery(manager)
      .where('companies.id = :id', { id: id.value })
      .getOneOrFail();

    return this._dataAccessMapper.toEntity(item);
  }

  async findOneReport(
    id: CompanyId,
    manager: EntityManager,
  ): Promise<ResponseResult<any>> {
    const item = await manager
      .createQueryBuilder(CompanyOrmEntity, 'company')
      .leftJoinAndSelect('company.company_users', 'company_users')
      .leftJoinAndSelect('company_users.user', 'user')
      .leftJoinAndSelect('company.budget_accounts', 'budget_accounts')
      .leftJoinAndSelect('budget_accounts.increase_budgets', 'increase_budgets')
      .leftJoinAndSelect('budget_accounts.budget_items', 'budget_items')
      .leftJoinAndSelect(
        'company.documents',
        'documents',
        'documents.status = :status',
        { status: 'pending' },
      )
      .leftJoinAndSelect('documents.receipts', 'receipts')

      .leftJoinAndSelect(
        'budget_items.increase_budget_detail',
        'increase_budget_detail',
      )
      .leftJoinAndSelect(
        'budget_items.document_transactions',
        'document_transactions',
      )
      .loadRelationCountAndMap(
        'company.approvalWorkflowCount',
        'company.approval_workflows',
      )
      .loadRelationCountAndMap(
        'company.budgetRuleCount',
        'company.budget_approval_rules',
      )
      .loadRelationCountAndMap('company.userCount', 'company.company_users')
      .where('company.id = :id', { id: id.value })

      .getOneOrFail();
    console.log('item', item);
    const allocated_amount =
      item.budget_accounts
        ?.flatMap((ba) => ba.increase_budgets ?? [])
        .reduce((sum, b) => sum + Number(b.allocated_amount ?? 0), 0) ?? 0;

    // รวม increase_amount ของ increase_budget_detail ใน budget_items
    const increase_amount =
      item.budget_accounts
        ?.flatMap((ba) => ba.budget_items ?? [])
        .flatMap((bi) => bi.increase_budget_detail ?? [])
        .reduce((sum, d) => sum + Number(d.allocated_amount ?? 0), 0) ?? 0;

    // รวม totalUsedAmount ของ document_transactions
    const totalUsedAmount =
      item.budget_accounts
        ?.flatMap((ba) => ba.budget_items ?? [])
        .flatMap((bi) => bi.document_transactions ?? [])
        .reduce((sum, dt) => sum + Number(dt.amount ?? 0), 0) ?? 0;

    const total_budget = allocated_amount - increase_amount;
    const balance_amount = increase_amount - totalUsedAmount;
    const result = {
      ...item,
      company_users: item.company_users?.map((cu) => {
        const { password, ...user } = cu.user;
        return user;
      }),
      logo: item?.logo
        ? `${process.env.AWS_CLOUDFRONT_DISTRIBUTION_DOMAIN_NAME}/${item.logo}`
        : null,
      allocated_amount,
      increase_amount,
      totalUsedAmount,
      total_budget,
      balance_amount,
    };
    return result;
  }

  private createBaseQuery(manager: EntityManager) {
    return manager
      .createQueryBuilder(CompanyOrmEntity, 'companies')
      .leftJoinAndSelect('companies.company_users', 'company_users')
      .leftJoinAndSelect('companies.departments', 'departments');
  }

  private getFilterOptions(): FilterOptions {
    return {
      searchColumns: ['companies.name', 'companies.email', 'companies.tel'],
      dateColumn: '',
      filterByColumns: [],
    };
  }

  async getReport(
    manager: EntityManager,
  ): Promise<ResponseResult<ReportCompanyInterface>> {
    const result = await manager
      .createQueryBuilder(CompanyOrmEntity, 'company')
      .leftJoin('company.budget_accounts', 'ba')
      .leftJoin('ba.increase_budgets', 'ib')
      .leftJoin('company.company_users', 'user') // join company users
      .select('COUNT(DISTINCT company.id)', 'total_companies') // count companies
      .addSelect('COALESCE(SUM(ib.allocated_amount), 0)', 'total_allocated') // sum allocated_amount
      .addSelect('COUNT(DISTINCT user.id)', 'total_users') // count unique users across companies
      .getRawOne();

    return {
      total_companies: Number(result.total_companies),
      total_allocated: Number(result.total_allocated),
      total_users: Number(result.total_users),
    };
  }

  async getReportReceipt(
    query: CompanyQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<CompanyEntity>> {
    const queryBuilder = await this.createReportQuery(manager);
    query.sort_by = 'companies.id';

    const data = await this._paginationService.paginate(
      queryBuilder,
      query,
      this._dataAccessMapper.toEntityReportReceipt.bind(this._dataAccessMapper),
      this.getFilterOptions(),
    );
    return data as ResponseResult<CompanyEntity>;
  }

  private createReportQuery(manager: EntityManager) {
    return manager
      .createQueryBuilder(CompanyOrmEntity, 'companies')
      .leftJoin('companies.documents', 'documents')
      .leftJoin('documents.receipts', 'receipts')
      .leftJoin('companies.budget_accounts', 'budget_accounts')
      .leftJoin('budget_accounts.increase_budgets', 'increase_budgets')
      .addSelect([
        'documents.id',
        'receipts.id',
        'budget_accounts.id',
        'increase_budgets.id',
        'increase_budgets.allocated_amount',
      ]);
  }
}
