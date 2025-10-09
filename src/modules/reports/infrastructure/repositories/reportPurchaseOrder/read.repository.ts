import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PAGINATION_SERVICE } from '@src/common/constants/inject-key.const';
import {
  selectApprover,
  selectApproverUserSignatures,
  selectBanks,
  selectBudgetAccounts,
  selectBudgetItems,
  selectCurrency,
  selectDepartments,
  selectDepartmentsApprover,
  selectDepartmentUserApprovers,
  selectDepartmentUsers,
  selectDocApproverUser,
  selectDocDeptUser,
  selectDocumentApprover,
  selectDocuments,
  selectDocumentStatuses,
  selectDocumentTypes,
  selectPoDepartments,
  selectPoDepartmentUsers,
  selectPoDocuments,
  selectPoDocumentTypes,
  selectPoPositions,
  selectPositionApprover,
  selectPositions,
  selectPoUsers,
  selectPoUserSignatures,
  selectPurchaseOrderItems,
  selectPurchaseOrderSelectedVendors,
  selectPurchaseRequestItems,
  selectPurchaseRequests,
  selectRequestItems,
  selectRequestItemUnits,
  selectSelectedVendors,
  selectStatus,
  selectUnits,
  selectUserApprovals,
  selectUserApprovalSteps,
  selectUsers,
  selectUserSignatures,
  selectVendorBankAccounts,
} from '@src/common/constants/select-field';
import { PurchaseOrderOrmEntity } from '@src/common/infrastructure/database/typeorm/purchase-order.orm';
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
import { ReportPurchaseOrderEntity } from '@src/modules/reports/domain/entities/report-purchase-order.entity';
import { IReportPurchaseOrderRepository } from '@src/modules/reports/domain/ports/output/purchase-order-repository.interface';
import { EntityManager, Repository } from 'typeorm';
import { ReportPurchaseOrderDataAccessMapper } from '../../mappers/report-purchase-order.mapper';
import { PurchaseOrderReportQueryDto } from '@src/modules/reports/application/dto/query/purchase-order-report.query.dto';

@Injectable()
export class ReportReadPurchaseOrderRepository
  implements IReportPurchaseOrderRepository
{
  constructor(
    @InjectRepository(PurchaseOrderOrmEntity)
    private readonly _purchaseOrderOrm: Repository<PurchaseOrderOrmEntity>,
    private readonly _dataAccessMapper: ReportPurchaseOrderDataAccessMapper,
    @Inject(PAGINATION_SERVICE)
    private readonly _paginationService: IPaginationService,
  ) {}

  async report(
    query: PurchaseOrderReportQueryDto,
    manager: EntityManager,
    user_id?: number,
    roles?: string[],
  ): Promise<ResponseResult<ReportPurchaseOrderEntity>> {
    const departmentId = Number(query.department_id);
    const status_id = Number(query.status_id);
    const filterOptions = this.getFilterOptions();
    const queryBuilder = await this.createBaseQuery(
      manager,
      departmentId,
      status_id,
      user_id,
      roles,
    );
    query.sort_by = 'purchase_orders.id';

    // Date filtering for delivery date
    this.applyDateFilter(
      queryBuilder,
      'purchase_orders.expired_date',
      query.start_date,
      query.end_date,
    );

    const status = await countStatusAmounts(
      manager,
      EnumPrOrPo.PO,
      user_id,
      roles,
      departmentId,
      status_id,
      query.start_date,
      query.end_date,
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
      ...selectPurchaseOrderItems,
      ...selectPurchaseOrderSelectedVendors,
      ...selectPurchaseRequests,
      ...selectDocuments,
      ...selectDocumentTypes,
      ...selectUsers,
      ...selectUserSignatures,
      ...selectDepartments,
      ...selectDepartmentUsers,
      ...selectPositions,
      ...selectPurchaseRequestItems,
      ...selectUnits,
      ...selectRequestItems,
      ...selectRequestItemUnits,
      ...selectSelectedVendors,
      ...selectCurrency,
      ...selectVendorBankAccounts,
      ...selectPoDocuments,
      ...selectPoDepartments,
      ...selectPoUsers,
      ...selectPoDocumentTypes,
      ...selectPoUserSignatures,
      ...selectPoDepartmentUsers,
      ...selectPoPositions,
      ...selectPurchaseRequestItems,

      ...selectUserApprovals,
      ...selectDocumentStatuses,
      ...selectUserApprovalSteps,
      ...selectApprover,
      ...selectApproverUserSignatures,
      ...selectStatus,
      ...selectBanks,
      ...selectBudgetItems,
      ...selectDepartmentUserApprovers,
      ...selectPositionApprover,
      ...selectBudgetAccounts,
      ...selectDocumentApprover,
      ...selectDocApproverUser,
      ...selectDocDeptUser,
      ...selectDepartmentsApprover,
    ];

    const query = manager
      .createQueryBuilder(PurchaseOrderOrmEntity, 'purchase_orders')
      .innerJoin('purchase_orders.purchase_order_items', 'purchase_order_items')
      .innerJoin(
        'purchase_order_items.purchase_order_selected_vendors',
        'purchase_order_selected_vendors',
      )
      .innerJoin('purchase_orders.purchase_requests', 'purchase_requests')
      .innerJoin(
        'purchase_requests.purchase_request_items',
        'purchase_request_items',
      )
      .innerJoin('purchase_requests.documents', 'documents')
      .innerJoin('documents.departments', 'departments')
      .innerJoin('documents.users', 'users')
      .innerJoin('documents.document_types', 'document_types')
      .leftJoin('users.user_signatures', 'user_signatures')
      .innerJoin('users.department_users', 'department_users')
      .innerJoin('department_users.positions', 'positions')

      .innerJoin('purchase_request_items.units', 'units')
      // purchase_order_items join with purchase request
      .innerJoin('purchase_order_items.purchase_request_items', 'request_items')
      .innerJoin('request_items.units', 'request_item_unit')
      .leftJoin('purchase_order_items.budget_item', 'budget_items')
      .leftJoin('budget_items.budget_accounts', 'budget_accounts')
      .innerJoin('purchase_order_selected_vendors.vendors', 'selected_vendors')
      // .leftJoin('selected_vendors.vendor_bank_accounts', 'vendor_bank_accounts')
      .leftJoin(
        'purchase_order_selected_vendors.vendor_bank_account',
        'vendor_bank_accounts',
      )
      .leftJoin('vendor_bank_accounts.banks', 'bank')
      .leftJoin('vendor_bank_accounts.currencies', 'currency')

      .innerJoin('purchase_orders.documents', 'po_documents')
      .innerJoin('po_documents.departments', 'po_departments')
      .innerJoin('po_documents.users', 'po_users')
      .innerJoin('po_documents.document_types', 'po_document_types')
      .leftJoin('po_users.user_signatures', 'po_user_signatures')
      .innerJoin('po_users.department_users', 'po_department_users')
      .innerJoin('po_department_users.positions', 'po_positions')

      .innerJoin('po_documents.user_approvals', 'user_approvals')
      .innerJoin('user_approvals.document_statuses', 'document_statuses')
      .innerJoin('user_approvals.user_approval_steps', 'user_approval_steps')
      .leftJoin('user_approval_steps.approver', 'approver')
      .leftJoin('approver.department_users', 'department_user_approver')
      .leftJoin('department_user_approver.positions', 'position_approver')
      .innerJoin('user_approval_steps.status', 'status')
      .leftJoin('approver.user_signatures', 'approver_user_signatures')
      .innerJoin(
        'user_approval_steps.document_approvers',
        'document_approver',
        'document_approver.user_approval_step_id = user_approval_steps.id',
      )
      .leftJoin('document_approver.users', 'doc_approver_user')
      .leftJoin('doc_approver_user.department_users', 'doc_dept_user')
      .leftJoin('doc_dept_user.departments', 'departments_approver')
      // add select
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
        'purchase_orders.po_number',
        'documents.title',
        'users.name',
        'users.email',
        'departments.name',
        'departments.code',
      ],
      dateColumn: 'purchase_orders.expired_date',
      filterByColumns: ['documents.department_id', 'user_approvals.status_id'],
    };
  }

  /**
   * ==> Applies date filter to the query builder if dateColumn and date are provided.
   */
  private applyDateFilter(
    queryBuilder: any,
    dateColumn: string,
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
      .createQueryBuilder(PurchaseOrderOrmEntity, 'purchase_orders')
      .innerJoin('purchase_orders.purchase_order_items', 'purchase_order_items')
      .select('document_statuses.name', 'status')
      .addSelect('SUM(purchase_order_items.total_price)', 'total')
      .addSelect('SUM(purchase_order_items.vat)', 'total_vat')
      .innerJoin('purchase_orders.documents', 'documents')
      .innerJoin('documents.user_approvals', 'user_approvals')
      .innerJoin('user_approvals.document_statuses', 'document_statuses')
      .groupBy('document_statuses.name')
      .getRawMany();

    const data = item.map((row) => ({
      status: row.status,
      total: Number(row.total) + Number(row.total_vat),
    }));

    return data;
  }

  async reportMoneyByPagination(
    query: PurchaseOrderReportQueryDto,
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
    query.sort_by = 'purchase_orders.id';

    // Date filtering for PO date
    this.applyDateFilter(
      queryBuilder,
      'purchase_orders.po_date',
      query.start_date,
      query.end_date,
    );

    const data = await this._paginationService.paginate(
      queryBuilder,
      query,
      this._dataAccessMapper.toEntity.bind(this._dataAccessMapper),
      filterOptions,
    );

    return data;
  }
}
