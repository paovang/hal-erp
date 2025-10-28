import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PAGINATION_SERVICE } from '@src/common/constants/inject-key.const';
import {
  selectApprover,
  selectApproverUserSignatures,
  selectDepartments,
  selectDepartmentUserApprovers,
  selectDepartmentUsers,
  selectDocuments,
  selectDocumentStatuses,
  selectDocumentTypes,
  selectPositionApprover,
  selectPositions,
  selectPurchaseRequestItems,
  selectStatus,
  selectUnits,
  selectUserApprovals,
  selectUserApprovalSteps,
  selectUsers,
  selectUserSignatures,
} from '@src/common/constants/select-field';
import { PurchaseRequestOrmEntity } from '@src/common/infrastructure/database/typeorm/purchase-request.orm';
import {
  FilterOptions,
  IPaginationService,
  ResponseResult,
} from '@src/common/infrastructure/pagination/pagination.interface';
import countStatusAmounts from '@src/common/utils/status-amount.util';
import {
  EligiblePersons,
  EnumPrOrPo,
} from '@src/modules/manage/application/constants/status-key.const';
import { ReportPurchaseRequestEntity } from '@src/modules/reports/domain/entities/report-purchase-request.entity.';
import { IReportPurchaseRequestRepository } from '@src/modules/reports/domain/ports/output/purchase-request-repository.interface';
import { EntityManager, Repository } from 'typeorm';
import { ReportPurchaseRequestDataAccessMapper } from '../../mappers/report-purchase-request.mapper';
import { PurchaseRequestReportQueryDto } from '@src/modules/reports/application/dto/query/purchase-request-report.query.dto';

@Injectable()
export class ReportReadPurchaseRequestRepository
  implements IReportPurchaseRequestRepository
{
  constructor(
    @InjectRepository(PurchaseRequestOrmEntity)
    private readonly _purchaseRequestOrm: Repository<PurchaseRequestOrmEntity>,
    private readonly _dataAccessMapper: ReportPurchaseRequestDataAccessMapper,
    @Inject(PAGINATION_SERVICE)
    private readonly _paginationService: IPaginationService,
  ) {}

  async report(
    query: PurchaseRequestReportQueryDto,
    manager: EntityManager,
    user_id?: number,
    roles?: string[],
  ): Promise<ResponseResult<ReportPurchaseRequestEntity>> {
    const departmentId = Number(query.department_id);
    const status_id = Number(query.status_id);
    const filterOptions = this.getFilterOptions();
    const queryBuilder = await this.createBaseQuery(
      manager,
      departmentId,
      status_id,
    );
    query.sort_by = 'purchase_requests.id';

    // Date filtering (single date)
    this.applyDateFilter(
      queryBuilder,
      filterOptions.dateColumn,
      query.requested_date_start,
      query.requested_date_end,
    );

    const status = await countStatusAmounts(
      manager,
      EnumPrOrPo.PR,
      user_id,
      roles,
      departmentId,
      status_id,
      query.requested_date_start,
      query.requested_date_end,
    );

    const data = await this._paginationService.paginate(
      queryBuilder,
      query,
      this._dataAccessMapper.toEntity.bind(this._dataAccessMapper),
      filterOptions,
    );

    return {
      ...data,
      status: status,
    };
  }

  private createBaseQuery(
    manager: EntityManager,
    departmentId?: number,
    status_id?: number,
    user_id?: number,
    roles?: string[],
  ) {
    const selectFields = [
      ...selectUnits,
      ...selectDepartments,
      ...selectUsers,
      ...selectDocuments,
      ...selectDocumentTypes,
      ...selectPurchaseRequestItems,
      ...selectUserSignatures,
      ...selectDepartmentUsers,
      ...selectPositions,
      ...selectUserApprovals,
      ...selectDocumentStatuses,
      ...selectUserApprovalSteps,
      ...selectApprover,
      ...selectApproverUserSignatures,
      ...selectStatus,
      ...selectDepartmentUserApprovers,
      ...selectPositionApprover,
    ];

    const query = manager
      .createQueryBuilder(PurchaseRequestOrmEntity, 'purchase_requests')
      .innerJoin(
        'purchase_requests.purchase_request_items',
        'purchase_request_items',
      )
      .innerJoin('purchase_requests.documents', 'documents')
      .leftJoin('documents.departments', 'departments')
      .leftJoin('documents.users', 'users')
      .innerJoin('documents.document_types', 'document_types')
      .leftJoin('users.user_signatures', 'user_signatures')
      .leftJoin('users.department_users', 'department_users')
      .innerJoin('purchase_request_items.units', 'units')
      .leftJoin('department_users.positions', 'positions')
      .innerJoin('documents.user_approvals', 'user_approvals')
      .innerJoin('user_approvals.document_statuses', 'document_statuses')
      .innerJoin('user_approvals.user_approval_steps', 'user_approval_steps')
      .leftJoin('user_approval_steps.approver', 'approver')
      .leftJoin('approver.department_users', 'department_user_approver')
      .leftJoin('department_user_approver.positions', 'position_approver')
      .leftJoin('user_approval_steps.status', 'status')
      .leftJoin('approver.user_signatures', 'approver_user_signatures')
      .innerJoin(
        'user_approval_steps.document_approvers',
        'document_approver',
        'document_approver.user_approval_step_id = user_approval_steps.id',
      )
      .addSelect(selectFields);

    if (
      roles &&
      !roles.includes(EligiblePersons.SUPER_ADMIN) &&
      !roles.includes(EligiblePersons.ADMIN)
    ) {
      query.andWhere('document_approver.user_id = :user_id', {
        user_id,
      });
    }

    if (departmentId) {
      query.andWhere('departments.id = :departmentId', { departmentId });
    }

    if (status_id) {
      query.andWhere('user_approvals.status_id = :status_id', { status_id });
    }

    return query;
  }

  /**
   * Get filter options
   */
  private getFilterOptions(): FilterOptions {
    return {
      searchColumns: [
        'purchase_requests.pr_number',
        'documents.title',
        'users.name',
        'users.email',
        'departments.name',
        'departments.code',
      ],
      dateColumn: 'purchase_requests.requested_date',
      filterByColumns: ['documents.department_id', 'user_approvals.status_id'],
    };
  }

  /**
   * ==> Applies date filter to the query builder if dateColumn and date are provided.
   */
  private applyDateFilter(
    queryBuilder: any, // Replace 'any' with your actual QueryBuilder type
    dateColumn: string | undefined,
    start_date?: string,
    end_date?: string,
  ) {
    if (dateColumn && start_date && end_date) {
      queryBuilder.andWhere(`${dateColumn} BETWEEN :dateStart AND :dateEnd`, {
        dateStart: `${start_date} 00:00:00`,
        dateEnd: `${end_date} 23:59:59`,
      });
    }
  }

  async reportMoney(manager: EntityManager): Promise<any> {
    const item = await manager
      .createQueryBuilder(PurchaseRequestOrmEntity, 'purchase_requests')
      .innerJoin(
        'purchase_requests.purchase_request_items',
        'purchase_request_items',
      )
      .select('document_statuses.name', 'status')
      .addSelect('SUM(purchase_request_items.total_price)', 'total')
      .innerJoin('purchase_requests.documents', 'documents')
      .innerJoin('documents.user_approvals', 'user_approvals')
      .innerJoin('user_approvals.document_statuses', 'document_statuses')
      .groupBy('document_statuses.name')
      .getRawMany();

    const data = item.map((row) => ({
      status: row.status,
      total: Number(row.total),
    }));

    return data;
  }

  async reportMoneyByPagination(
    query: PurchaseRequestReportQueryDto,
    manager: EntityManager,
  ): Promise<any> {
    const departmentId = Number(query.department_id);
    const status_id = Number(query.status_id);
    const filterOptions = this.getFilterOptions();
    const queryBuilder = await this.createBaseQuery(
      manager,
      departmentId,
      status_id,
    );
    query.sort_by = 'purchase_requests.id';

    // Date filtering (single date)
    this.applyDateFilter(
      queryBuilder,
      filterOptions.dateColumn,
      query.requested_date_start,
      query.requested_date_end,
    );

    const data = await this._paginationService.paginate(
      queryBuilder,
      query,
      this._dataAccessMapper.toEntity.bind(this._dataAccessMapper),
      filterOptions,
    );

    return data;
  }

  async getProcurementStatistics(manager: EntityManager): Promise<any> {
    // Get PR statistics
    const prStats = await this.getDocumentStatistics(manager, 'PR');

    // Get PO statistics
    const poStats = await this.getDocumentStatistics(manager, 'PO');

    // Get Receipt statistics
    const receiptStats = await this.getDocumentStatistics(manager, 'RC');

    return {
      pr: prStats,
      po: poStats,
      receipt: receiptStats,
    };
  }

  private async getDocumentStatistics(manager: EntityManager, documentType: string): Promise<any> {
    const queryBuilder = manager
      .createQueryBuilder('documents', 'documents')
      .innerJoin('documents.document_types', 'document_types')
      .select('document_types.type', 'type')
      .addSelect('COUNT(documents.id)', 'all')
      .addSelect('SUM(CASE WHEN documents.status = :pending THEN 1 ELSE 0 END)', 'pending')
      .addSelect('SUM(CASE WHEN documents.status = :success THEN 1 ELSE 0 END)', 'approved')
      .addSelect('SUM(CASE WHEN documents.status = :rejected THEN 1 ELSE 0 END)', 'rejected')
      .where('document_types.type = :documentType', { documentType })
      .setParameter('pending', 'pending')
      .setParameter('success', 'success')
      .setParameter('rejected', 'rejected')
      .groupBy('document_types.type');

    const result = await queryBuilder.getRawOne();

    return {
      all: parseInt(result?.all || '0'),
      pending: parseInt(result?.pending || '0'),
      approved: parseInt(result?.approved || '0'),
      rejected: parseInt(result?.rejected || '0'),
    };
  }
}
