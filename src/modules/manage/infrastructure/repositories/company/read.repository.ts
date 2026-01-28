import { Inject, Injectable } from '@nestjs/common';
import { CompanyOrmEntity } from '@src/common/infrastructure/database/typeorm/company.orm';
import { IReadCompanyRepository } from '@src/modules/manage/domain/ports/output/company-repository.interface';
import { CompanyDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/company.mapper';
import {
  CompanyQueryDto,
  reportHalGroupQueryDto,
} from '@src/modules/manage/application/dto/query/company-query.dto';
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
import { DocumentOrmEntity } from '@src/common/infrastructure/database/typeorm/document.orm';
import { UserContextService } from '@src/common/infrastructure/cls/cls.service';
import { UserApprovalStepOrmEntity } from '@src/common/infrastructure/database/typeorm/user-approval-step.orm';
type CompanyIda = string;

type NumberMap = Record<CompanyIda, number>;

type ReceiptSummaryMap = Record<
  CompanyIda,
  {
    totalReceipts: number;
    totalReceiptsPadding: number;
  }
>;

type BudgetSummaryMap = Record<
  CompanyIda,
  {
    allocated: number;
    increase: number;
  }
>;
@Injectable()
export class ReadCompanyRepository implements IReadCompanyRepository {
  constructor(
    private readonly _dataAccessMapper: CompanyDataAccessMapper,
    @Inject(PAGINATION_SERVICE)
    private readonly _paginationService: IPaginationService,
    @InjectRepository(CompanyOrmEntity)
    private readonly _companyRepository: Repository<CompanyOrmEntity>,
    @InjectRepository(DocumentOrmEntity)
    private readonly _documentTypeOrm: Repository<DocumentOrmEntity>,
    private readonly _userContextService: UserContextService,
  ) {}

  async getUsersSummary(
    query: reportHalGroupQueryDto,
    manager: EntityManager,
  ): Promise<NumberMap> {
    const qb = manager
      .createQueryBuilder()
      .select('cu.company_id', 'companyId')
      .addSelect('COUNT(*)', 'totalUsers')
      .from('company_users', 'cu');

    if (query.company_id) {
      qb.where('cu.company_id = :id', { id: Number(query.company_id) });
    }

    const rows = await qb.groupBy('cu.company_id').getRawMany();

    const result: NumberMap = {};
    for (const r of rows) {
      result[r.companyId] = Number(r.totalUsers);
    }

    return result;
  }
  async getReceiptsSummary(
    query: reportHalGroupQueryDto,
    manager: EntityManager,
  ): Promise<ReceiptSummaryMap> {
    const user = this._userContextService.getAuthUser()?.user;
    const userId = user?.id;

    const qb = manager
      .createQueryBuilder(UserApprovalStepOrmEntity, 'step')
      .leftJoin('step.user_approvals', 'ua')
      .leftJoin('ua.documents', 'd')
      .leftJoin('d.receipts', 'r')
      .select('d.company_id', 'companyId')
      .addSelect('COUNT(step.id)', 'totalReceipts')
      .addSelect(
        `COUNT(DISTINCT CASE WHEN step.status_id = :pendingStatus THEN r.id END)`,
        'totalReceiptsPending',
      )
      .where('step.approver_id = :userId', { userId })
      .andWhere('step.deleted_at IS NULL')
      .andWhere('ua.deleted_at IS NULL')
      .andWhere('d.deleted_at IS NULL')
      .andWhere('r.deleted_at IS NULL')
      .setParameter('pendingStatus', 1);

    if (query.company_id) {
      qb.andWhere('d.company_id = :companyId', {
        companyId: Number(query.company_id),
      });
    }

    const rows = await qb.groupBy('d.company_id').getRawMany();

    const result: ReceiptSummaryMap = {};

    for (const row of rows) {
      result[row.companyId] = {
        totalReceipts: Number(row.totalReceipts),
        totalReceiptsPadding: Number(row.totalReceiptsPending),
      };
    }

    return result;
  }

  //////////////////////////////////////////////////////
  async getBudgetSummary(
    query: reportHalGroupQueryDto,
    manager: EntityManager,
  ): Promise<BudgetSummaryMap> {
    const allocatedRows = await manager
      .createQueryBuilder()
      .select('ba.company_id', 'companyId')
      .addSelect('SUM(ba.allocated_amount)', 'allocated')
      .from('budget_accounts', 'ba')
      .groupBy('ba.company_id')
      .getRawMany();

    const increaseRows = await manager
      .createQueryBuilder()
      .select('ba.company_id', 'companyId')
      .addSelect('SUM(ib.allocated_amount)', 'increase')
      .from('increase_budgets', 'ib')
      .innerJoin('budget_accounts', 'ba', 'ba.id = ib.budget_account_id')
      .groupBy('ba.company_id')
      .getRawMany();

    const result: BudgetSummaryMap = {};

    for (const r of allocatedRows) {
      result[r.companyId] = {
        allocated: Number(r.allocated),
        increase: 0,
      };
    }

    for (const r of increaseRows) {
      if (!result[r.companyId]) {
        result[r.companyId] = { allocated: 0, increase: 0 };
      }
      result[r.companyId].increase = Number(r.increase);
    }

    return result;
  }
  async getUsedBudgetSummary(
    query: reportHalGroupQueryDto,
    manager: EntityManager,
  ): Promise<NumberMap> {
    const qb = manager
      .createQueryBuilder()
      .select('ba.company_id', 'companyId')
      .addSelect('SUM(dt.amount)', 'used')
      .from('document_transactions', 'dt')
      .innerJoin('budget_items', 'bi', 'bi.id = dt.budget_item_id')
      .innerJoin('budget_accounts', 'ba', 'ba.id = bi.budget_account_id')
      .groupBy('ba.company_id');

    const rows = await qb.getRawMany();

    const result: NumberMap = {};
    for (const r of rows) {
      result[r.companyId] = Number(r.used);
    }

    return result;
  }

  async getHalGroupState(
    query: reportHalGroupQueryDto,
    manager: EntityManager,
  ): Promise<{
    totalUsers: number;
    totalReceipts: number;
    totalReceiptsPadding: number;
    allocated_amount: number;
    increase_amount: number;
    totalUsedAmount: number;
    total_budget: number;
  }> {
    const [users, receipts, budgets, usedBudgets] = await Promise.all([
      this.getUsersSummary(query, manager),
      this.getReceiptsSummary(query, manager),
      this.getBudgetSummary(query, manager),
      this.getUsedBudgetSummary(query, manager),
    ]);

    let totalUsers = 0;
    let totalReceipts = 0;
    let totalReceiptsPadding = 0;
    let allocated_amount = 0;
    let increase_amount = 0;
    let totalUsedAmount = 0;

    const companyIds = new Set<CompanyIda>([
      ...Object.keys(users),
      ...Object.keys(receipts),
      ...Object.keys(budgets),
      ...Object.keys(usedBudgets),
    ]);

    for (const id of companyIds) {
      totalUsers += users[id] ?? 0;
      totalReceipts += receipts[id]?.totalReceipts ?? 0;
      totalReceiptsPadding += receipts[id]?.totalReceiptsPadding ?? 0;
      allocated_amount += budgets[id]?.allocated ?? 0;
      increase_amount += budgets[id]?.increase ?? 0;
      totalUsedAmount += usedBudgets[id] ?? 0;
    }

    return {
      totalUsers,
      totalReceipts,
      totalReceiptsPadding,
      allocated_amount,
      increase_amount,
      totalUsedAmount,
      total_budget: allocated_amount + increase_amount - totalUsedAmount,
    };
  }

  async findAll(
    query: CompanyQueryDto,
    // .addSelect('COUNT(DISTINCT documents)', 'totalDocuments')
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
      .innerJoinAndSelect('documents.receipts', 'receipts')
      .innerJoinAndSelect('receipts.receipt_items', 'receipt_items')

      .loadRelationCountAndMap(
        'company.approvalWorkflowCount',
        'company.documents',
        'documentsCount',
        (qb) =>
          qb
            .innerJoin('documentsCount.receipts', 'receiptsCount')
            .where('documentsCount.status = :status', { status: 'pending' }),
      ) // เปลี่ยนเป็น innerJoinAndSelect

      .leftJoinAndSelect(
        'budget_items.increase_budget_detail',
        'increase_budget_detail',
      )
      .leftJoinAndSelect(
        'budget_items.document_transactions',
        'document_transactions',
      )
      // .loadRelationCountAndMap(
      //   'company.approvalWorkflowCount',
      //   'company.approval_workflows',
      // )
      .loadRelationCountAndMap(
        'company.budgetRuleCount',
        'company.budget_approval_rules',
      )
      .loadRelationCountAndMap('company.userCount', 'company.company_users')
      .where('company.id = :id', { id: id.value })

      .getOneOrFail();
    // console.log('item', item);
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
      // company_users: item.company_users?.map((cu) => {
      //   const { password, ...user } = cu.user;
      //   return user;
      // }),
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
    // Fetch all companies with their relations
    const companies = await manager
      .createQueryBuilder(CompanyOrmEntity, 'company')
      .leftJoinAndSelect('company.budget_accounts', 'ba')
      .leftJoinAndSelect('ba.increase_budgets', 'ib')
      .leftJoinAndSelect('company.company_users', 'user')
      .getMany();

    // Use mapper to calculate statistics (avoids JOIN duplication)
    return this._dataAccessMapper.calculateReportStats(companies);
  }

  async getReportReceipt(
    query: CompanyQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<CompanyEntity>> {
    const queryBuilder = await this.createReportQuery(manager);

    // query.sort_by = sort_columns.includes(query.sort_by);

    const allowedSortFields = {
      id: 'companies.id',
      name: 'companies.name',
      created_at: 'companies.created_at',
      updated_at: 'companies.updated_at',
    };

    // Get the requested sort_by value, or use the safe default
    let sortBy = query?.sort_by ?? 'companies.id';

    // Map the sort field to its proper alias, or use default if not allowed
    sortBy =
      allowedSortFields[sortBy as keyof typeof allowedSortFields] ||
      'companies.id';

    query.sort_by = sortBy;

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
      .leftJoin('budget_accounts.budget_items', 'budget_items')
      .leftJoin('budget_accounts.increase_budgets', 'increase_budgets')
      .leftJoin('budget_items.document_transactions', 'document_transactions')
      .addSelect([
        'documents.id',
        'receipts.id',
        'budget_accounts.id',
        'increase_budgets.id',
        'increase_budgets.allocated_amount',
        'budget_items.id',
        'budget_items.name',
        'document_transactions.id',
        'document_transactions.amount',
      ]);
  }
}
