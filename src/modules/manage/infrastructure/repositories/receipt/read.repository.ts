import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PAGINATION_SERVICE } from '@src/common/constants/inject-key.const';
import { ReceiptOrmEntity } from '@src/common/infrastructure/database/typeorm/receipt.orm';
import {
  FilterOptions,
  IPaginationService,
  ResponseResult,
} from '@src/common/infrastructure/pagination/pagination.interface';
import {
  IReadReceiptRepository,
  ReceiptPrintResult,
} from '@src/modules/manage/domain/ports/output/receipt-repository.interface';
import { EntityManager, Repository } from 'typeorm';
import { ReceiptDataAccessMapper } from '../../mappers/receipt.mapper';
import { PurchaseOrderDataAccessMapper } from '../../mappers/purchase-order.mapper';
import { PurchaseRequestDataAccessMapper } from '../../mappers/purchase-request.mapper';
import { ReceiptQueryDto } from '@src/modules/manage/application/dto/query/receipt.dto';
import { ReceiptExportQueryDto } from '@src/modules/manage/application/dto/query/receipt-export.dto';
import { ReceiptEntity } from '@src/modules/manage/domain/entities/receipt.entity';
import {
  EligiblePersons,
  EnumPrOrPo,
} from '@src/modules/manage/application/constants/status-key.const';
import {
  selectApprover,
  selectApproverUserSignatures,
  selectBankAccountCurrencies,
  selectBanks,
  selectBudgetAccounts,
  selectBudgetItems,
  selectCompany,
  selectCreatedBy,
  selectCurrencies,
  selectCurrency,
  selectDepartments,
  selectDepartmentsApprover,
  selectDepartmentUserApprovers,
  selectDepartmentUsers,
  selectDocApproverUser,
  selectDocDeptUser,
  selectDocumentApprover,
  selectDocumentAttachments,
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
  selectPrDocuments,
  selectPrDocumentTypes,
  selectProducts,
  selectPurchaseOrderItems,
  selectPurchaseOrders,
  selectPurchaseOrderSelectedVendors,
  selectPurchaseRequestItems,
  selectPurchaseRequests,
  selectQuotaCompany,
  selectReceipt,
  selectReceiptBy,
  selectReceiptItems,
  selectRequestItems,
  selectSelectedVendors,
  selectStatus,
  selectUnits,
  selectUserApprovals,
  selectUserApprovalSteps,
  selectUsers,
  selectUserSignatures,
  selectVendorBankAccounts,
  selectVendorProduct,
  selectVendors,
} from '@src/common/constants/select-field';
import countStatusAmounts from '@src/common/utils/status-amount.util';
import { ReceiptId } from '@src/modules/manage/domain/value-objects/receitp-id.vo';
import { ApprovalWorkflowStepOrmEntity } from '@src/common/infrastructure/database/typeorm/approval-workflow-step.orm';
import { UserApprovalStepOrmEntity } from '@src/common/infrastructure/database/typeorm/user-approval-step.orm';
import { PurchaseRequestType } from '@src/modules/manage/application/dto/query/purchase-request.dto';
import { PurchaseOrderOrmEntity } from '@src/common/infrastructure/database/typeorm/purchase-order.orm';
import { PurchaseRequestOrmEntity } from '@src/common/infrastructure/database/typeorm/purchase-request.orm';
import { PrintEnum } from '@src/common/enums/print.enum';

@Injectable()
export class ReadReceiptRepository implements IReadReceiptRepository {
  constructor(
    @InjectRepository(ReceiptOrmEntity)
    private readonly _receiptOrm: Repository<ReceiptOrmEntity>,
    private readonly _dataAccessMapper: ReceiptDataAccessMapper,
    private readonly _purchaseOrderDataAccessMapper: PurchaseOrderDataAccessMapper,
    private readonly _purchaseRequestDataAccessMapper: PurchaseRequestDataAccessMapper,
    @Inject(PAGINATION_SERVICE)
    private readonly _paginationService: IPaginationService,
  ) {}
  // async findAll(
  //   query: ReceiptQueryDto,
  //   manager: EntityManager,
  //   user_id?: number,
  //   roles?: string[],
  //   company_id?: number,
  // ): Promise<ResponseResult<ReceiptEntity>> {
  //   const department_id = Number(query.department_id);
  //   const status_id = Number(query.status_id);
  //   const start_date = query.start_date;
  //   const end_date = query.end_date;
  //   const payment_type = query.payment_type;
  //   const companyID = Number(query.company_id);
  //   const filterOptions = this.getFilterOptions();
  //   const queryBuilder = await this.createBaseQuery(
  //     manager,
  //     user_id,
  //     roles,
  //     department_id,
  //     status_id,
  //     start_date,
  //     end_date,
  //     payment_type,
  //     company_id,
  //     companyID,
  //     query.type,
  //   );
  //   query.sort_by = 'receipts.id';

  //   // Date filtering (single date)
  //   this.applyDateFilter(
  //     queryBuilder,
  //     filterOptions.dateColumn,
  //     query.order_date,
  //   );

  //   const status = await countStatusAmounts(
  //     manager,
  //     EnumPrOrPo.R,
  //     user_id,
  //     roles,
  //     department_id,
  //     status_id,
  //     start_date,
  //     end_date,
  //     company_id,
  //     companyID,
  //   );

  //   const data = await this._paginationService.paginate(
  //     queryBuilder,
  //     query,
  //     this._dataAccessMapper.toEntity.bind(this._dataAccessMapper),
  //     this.getFilterOptions(),
  //   );

  //   return {
  //     ...data,
  //     status: status,
  //   };
  // }
  async findAll(
    query: ReceiptQueryDto,
    manager: EntityManager,
    user_id?: number,
    roles?: string[],
    company_id?: number,
  ): Promise<ResponseResult<ReceiptEntity>> {
    const department_id = Number(query.department_id);
    const status_id = Number(query.status_id);
    const start_date = query.start_date;
    const end_date = query.end_date;
    const payment_type = query.payment_type;
    const companyID = Number(query.company_id);
    const filterOptions = this.getFilterOptions();

    query.sort_by = 'receipts.id';

    // --- Step 1: ดึง IDs ---
    const idQueryBuilder = await this.createBaseQuery(
      manager,
      user_id,
      roles,
      department_id,
      status_id,
      start_date,
      end_date,
      payment_type,
      company_id,
      companyID,
      query.type,
    );

    this.applyDateFilter(
      idQueryBuilder,
      filterOptions.dateColumn,
      query.order_date,
    );

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const offset = (page - 1) * limit;

    const [idRows, totalRow] = await Promise.all([
      idQueryBuilder
        .clone()
        .select('receipts.id', 'id')
        .groupBy('receipts.id')
        .orderBy('receipts.id', 'DESC')
        .limit(limit)
        .offset(offset)
        .getRawMany<{ id: number }>(),
      idQueryBuilder
        .clone()
        .select('COUNT(DISTINCT receipts.id)', 'count')
        .getRawOne<{ count: string }>(),
    ]);

    const total = Number(totalRow?.count ?? 0);
    const ids = idRows.map((r) => Number(r.id));

    // --- Step 2: Fetch ข้อมูลเต็ม ---
    let items: ReceiptOrmEntity[] = [];

    if (ids.length > 0) {
      const fullQuery = await this.createBaseQuery(manager);
      items = await fullQuery
        .where('receipts.id IN (:...ids)', { ids })
        .orderBy('receipts.id', 'DESC')
        .getMany();
    }

    // --- Step 3: Map พร้อมนับ approval steps ---
    const mappedItems = await Promise.all(
      items.map(async (item) => {
        const user_approval_step = await manager
          .createQueryBuilder(UserApprovalStepOrmEntity, 'steps')
          .innerJoin('steps.user_approvals', 'user_approvals')
          .where('user_approvals.document_id = :id', { id: item.document_id })
          .getCount();

        const workflow_step = await manager
          .createQueryBuilder(ApprovalWorkflowStepOrmEntity, 'steps')
          .innerJoin('steps.approval_workflows', 'approval_workflows')
          .where('approval_workflows.document_type_id = :id', {
            id: item.documents.document_type_id,
          })
          .getCount();

        const step = workflow_step - user_approval_step;
        return this._dataAccessMapper.toEntity(item, step);
      }),
    );

    // --- Step 4: Status amounts ---
    const status = await countStatusAmounts(
      manager,
      EnumPrOrPo.R,
      user_id,
      roles,
      department_id,
      status_id,
      start_date,
      end_date,
      company_id,
      companyID,
    );

    return {
      status,
      pagination: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
      data: mappedItems,
    };
  }
  async findAllForExport(
    query: ReceiptExportQueryDto,
    manager: EntityManager,
    user_id?: number,
    roles?: string[],
    company_id?: number,
  ): Promise<ReceiptEntity[]> {
    const department_id = query.department_id ? Number(query.department_id) : undefined;
    const status_id = query.status_id ? Number(query.status_id) : undefined;
    const payment_type = query.payment_type;
    const companyID = query.company_id ? Number(query.company_id) : undefined;

    const queryBuilder = this.createBaseQuery(
      manager,
      user_id,
      roles,
      department_id,
      status_id,
      undefined,
      undefined,
      payment_type,
      company_id,
      companyID,
      query.type,
    );

    queryBuilder.andWhere(
      'receipts.created_at BETWEEN :startDate AND :endDate',
      { startDate: query.startDate, endDate: query.endDate },
    );

    const items = await queryBuilder
      .orderBy('receipts.id', 'DESC')
      .getMany();

    return Promise.all(
      items.map((item) => this._dataAccessMapper.toEntity(item, 0)),
    );
  }

  private createBaseQuery(
    manager: EntityManager,
    user_id?: number,
    roles?: string[],
    department_id?: number,
    status_id?: number,
    start_date?: string,
    end_date?: string,
    payment_type?: string,
    company_id?: number,
    companyID?: number,
    type?: PurchaseRequestType,
  ) {
    const selectFields = [
      ...selectReceiptItems,
      ...selectDepartments,
      ...selectUsers,
      ...selectDocuments,
      ...selectDocumentTypes,
      ...selectDepartmentUsers,
      ...selectPositions,
      ...selectUserApprovals,
      ...selectDocumentStatuses,
      ...selectUserApprovalSteps,
      ...selectApprover,
      ...selectApproverUserSignatures,
      ...selectStatus,
      ...selectReceiptBy,
      ...selectCurrencies,
      ...selectCurrency,
      ...selectDocumentAttachments,
      ...selectCreatedBy,
      ...selectDepartmentUserApprovers,
      ...selectPositionApprover,
      ...selectPurchaseOrderItems,
      ...selectPurchaseRequestItems,
      ...selectPurchaseOrderSelectedVendors,
      ...selectSelectedVendors,
      ...selectVendorBankAccounts,
      ...selectBanks,
      ...selectBankAccountCurrencies,
      ...selectDocumentApprover,
      ...selectDocApproverUser,
      ...selectDocDeptUser,
      ...selectDepartmentsApprover,
      ...selectBudgetItems,
      ...selectPurchaseOrders,
      ...selectPoDocuments,
      ...selectPoDocumentTypes,
      ...selectPurchaseRequests,
      ...selectPrDocuments,
      ...selectPrDocumentTypes,
      ...selectBudgetAccounts,
      ...selectUnits,
      ...selectCompany,
      ...selectQuotaCompany,
      ...selectVendorProduct,
      ...selectProducts,
      ...selectVendors,
    ];

    const query = manager
      .createQueryBuilder(ReceiptOrmEntity, 'receipts')
      .innerJoin('receipts.purchase_orders', 'purchase_orders')
      .innerJoin('purchase_orders.documents', 'po_documents')
      .innerJoin('po_documents.document_types', 'po_document_types')
      .innerJoin('purchase_orders.purchase_requests', 'purchase_requests')
      .innerJoin('purchase_requests.documents', 'pr_documents')
      .innerJoin('pr_documents.document_types', 'pr_document_types')
      .innerJoin('receipts.documents', 'documents')
      .leftJoin('documents.company', 'company')

      .innerJoin('documents.departments', 'departments')
      .innerJoin('documents.users', 'users')
      .innerJoin('documents.document_types', 'document_types')
      .innerJoin('users.department_users', 'department_users')
      .innerJoin('department_users.positions', 'positions')
      .innerJoin('receipts.users', 'receipt_by')
      .innerJoin('receipts.receipt_items', 'receipt_items')
      .innerJoin('receipt_items.currency', 'currency')
      .innerJoin('receipt_items.payment_currency', 'currencies')
      .innerJoin('receipt_items.purchase_order_items', 'purchase_order_items')
      .innerJoin(
        'purchase_order_items.purchase_request_items',
        'purchase_request_items',
      )
      .innerJoin('purchase_request_items.units', 'units')

      .leftJoin('purchase_request_items.quota_company', 'quota_company')
      .leftJoin('quota_company.vendor_product', 'vendor_product')
      .leftJoin('vendor_product.products', 'products')
      .leftJoin('vendor_product.vendors', 'vendors')
      .leftJoin('products.product_type', 'product_type')

      .leftJoin('purchase_order_items.budget_item', 'budget_items')
      .leftJoin('budget_items.budget_accounts', 'budget_accounts')
      .innerJoin(
        'purchase_order_items.purchase_order_selected_vendors',
        'purchase_order_selected_vendors',
      )
      .innerJoin('purchase_order_selected_vendors.vendors', 'selected_vendors')
      .leftJoin(
        'purchase_order_selected_vendors.vendor_bank_account',
        'vendor_bank_accounts',
      )
      .leftJoin('vendor_bank_accounts.banks', 'bank')
      .leftJoin('vendor_bank_accounts.currencies', 'bank_account_currency')
      .innerJoin('documents.user_approvals', 'user_approvals')
      .innerJoin('user_approvals.document_statuses', 'document_statuses')
      .innerJoin('user_approvals.user_approval_steps', 'user_approval_steps')
      // join document_approvers with explicit ON clause to emphasize relation
      .innerJoin(
        'user_approval_steps.document_approvers',
        'document_approver',
        'document_approver.user_approval_step_id = user_approval_steps.id',
      )
      .leftJoin('user_approval_steps.approver', 'approver')
      .leftJoin('approver.department_users', 'department_user_approver')
      .leftJoin('department_user_approver.positions', 'position_approver')
      .leftJoin('user_approval_steps.status', 'status')
      .leftJoin('approver.user_signatures', 'approver_user_signatures')
      .leftJoin('documents.document_attachments', 'document_attachments')
      .leftJoin('document_attachments.users', 'created_by')
      .leftJoin('document_approver.users', 'doc_approver_user')
      .leftJoin('doc_approver_user.department_users', 'doc_dept_user')
      .leftJoin('doc_dept_user.departments', 'departments_approver')
      .addSelect(selectFields);
    // console.log(roles);
    if (
      roles &&
      !roles.includes(EligiblePersons.ADMIN) &&
      !roles.includes(EligiblePersons.SUPER_ADMIN)
    ) {
      if (
        roles.includes(EligiblePersons.COMPANY_ADMIN) ||
        roles.includes(EligiblePersons.COMPANY_USER)
      ) {
        if (company_id) {
          query.andWhere('documents.company_id = :company_id', { company_id });
        }
      } else {
        switch (type) {
          case PurchaseRequestType.only_user:
            query.andWhere('document_approver.user_id = :user_id', {
              user_id,
            });
            break;

          case PurchaseRequestType.all:
            query.andWhere(
              `departments_approver.id IN (
              SELECT du.department_id
              FROM department_users du
              WHERE du.user_id = :user_id
            )`,
              { user_id },
            );
            query.andWhere('document_approver.user_id = :user_id', {
              user_id,
            });
            break;
        }
      }
    }

    if (companyID) {
      query.andWhere('documents.company_id = :companyID', { companyID });
    }

    if (department_id) {
      query.andWhere('departments.id = :department_id', { department_id });
    }

    if (status_id) {
      query.andWhere('user_approvals.status_id = :status_id', { status_id });
    }

    if (start_date && end_date) {
      query.andWhere(
        'receipts.receipt_date BETWEEN :start_date AND :end_date',
        {
          start_date: `${start_date} 00:00:00`,
          end_date: `${end_date} 23:59:59`,
        },
      );
    }

    if (payment_type) {
      query.andWhere('receipt_items.payment_type = :payment_type', {
        payment_type,
      });
    }

    return query;
  }

  private createBasePurchaseOrderQuery(
    manager: EntityManager,
    roles?: string[],
    user_id?: number,
    company_id?: number,
    type?: PurchaseRequestType,
  ) {
    const selectFields = [
      ...selectPurchaseOrderItems,
      ...selectPurchaseOrderSelectedVendors,
      // ...selectPurchaseRequests,
      // ...selectDocuments,
      // ...selectDocumentTypes,
      // ...selectUsers,
      // ...selectUserSignatures,
      // ...selectDepartments,
      // ...selectDepartmentUsers,
      // ...selectPositions,
      // ...selectPurchaseRequestItems,
      // ...selectUnits,
      ...selectRequestItems,
      // ...selectRequestItemUnits,
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
      // ...selectPurchaseRequestItems,

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
      ...selectCompany,
      ...selectQuotaCompany,
      ...selectVendorProduct,
      ...selectProducts,
      ...selectVendors,
      ...selectReceipt,
    ];

    const query = manager
      .createQueryBuilder(PurchaseOrderOrmEntity, 'purchase_orders')
      .innerJoin('purchase_orders.purchase_order_items', 'purchase_order_items')
      .innerJoin(
        'purchase_order_items.purchase_order_selected_vendors',
        'purchase_order_selected_vendors',
      )
      // .innerJoin('purchase_orders.purchase_requests', 'purchase_requests')
      // .innerJoin(
      //   'purchase_requests.purchase_request_items',
      //   'purchase_request_items',
      // )
      // .innerJoin('purchase_requests.documents', 'documents')
      // .innerJoin('documents.departments', 'departments')
      // .innerJoin('documents.users', 'users')
      // .innerJoin('documents.document_types', 'document_types')
      // .leftJoin('users.user_signatures', 'user_signatures')
      // .innerJoin('users.department_users', 'department_users')
      // .innerJoin('department_users.positions', 'positions')

      // .innerJoin('purchase_request_items.units', 'units')

      // purchase_order_items join with purchase request
      .innerJoin('purchase_order_items.purchase_request_items', 'request_items')
      .innerJoin('request_items.units', 'request_item_unit')
      .leftJoin('purchase_order_items.budget_item', 'budget_items')
      .leftJoin('budget_items.budget_accounts', 'budget_accounts')
      .innerJoin('purchase_order_selected_vendors.vendors', 'selected_vendors')
      // .leftJoin('selected_vendors.vendor_bank_accounts', 'vendor_bank_accounts')
      .leftJoin('request_items.quota_company', 'quota_company')

      .leftJoin('quota_company.vendor_product', 'vendor_product')
      .leftJoin('vendor_product.products', 'products')
      .leftJoin('vendor_product.vendors', 'vendors')
      .leftJoin('products.product_type', 'product_type')

      .leftJoin(
        'purchase_order_selected_vendors.vendor_bank_account',
        'vendor_bank_accounts',
      )
      .leftJoin('vendor_bank_accounts.banks', 'bank')
      .leftJoin('vendor_bank_accounts.currencies', 'currency')

      .innerJoin('purchase_orders.documents', 'po_documents')
      .leftJoin('po_documents.company', 'company')
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
      .leftJoin('purchase_orders.receipts', 'receipts')
      // add select
      .addSelect(selectFields);

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
          query.andWhere('po_documents.company_id = :company_id', {
            company_id,
          });
        }
      } else {
        // query.andWhere('document_approver.user_id = :user_id', {
        //   user_id,
        // });
        switch (type) {
          case PurchaseRequestType.only_user:
            query.andWhere('document_approver.user_id = :user_id', {
              user_id,
            });
            break;
          case PurchaseRequestType.all:
            query.andWhere(
              `departments_approver.id IN (
                SELECT du.department_id
                FROM department_users du
                WHERE du.user_id = :user_id
              )`,
              { user_id },
            );
            break;
        }
      }
    }

    return query;
  }

  /**
   * Create base query
   * @param manager
   * @param departmentId
   * @param user_id
   * @param roles
   * @returns
   */
  private createBasePurchaseRequestQuery(
    manager: EntityManager,
    departmentId?: number,
    user_id?: number,
    roles?: string[],
    company_id?: number,
    type?: PurchaseRequestType,
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
      ...selectDocumentApprover,
      ...selectDocApproverUser,
      ...selectDocDeptUser,
      ...selectDepartmentsApprover,
      ...selectCompany,
      ...selectQuotaCompany,
      ...selectVendorProduct,
      ...selectProducts,
      ...selectVendors,
      ...selectPurchaseOrders,
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
      .leftJoin('documents.company', 'company')
      .leftJoin('users.user_signatures', 'user_signatures')
      .leftJoin('users.department_users', 'department_users')
      .innerJoin('purchase_request_items.units', 'units')
      .innerJoin('purchase_request_items.quota_company', 'quota_company')

      .leftJoin('quota_company.vendor_product', 'vendor_product')
      .leftJoin('vendor_product.products', 'products')
      .leftJoin('vendor_product.vendors', 'vendors')
      .leftJoin('products.product_type', 'product_type')

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
      .leftJoin('document_approver.users', 'doc_approver_user')
      .leftJoin('doc_approver_user.department_users', 'doc_dept_user')
      .leftJoin('doc_dept_user.departments', 'departments_approver')
      .leftJoin('purchase_requests.purchase_orders', 'purchase_orders')
      .addSelect(selectFields);

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
          query.where('documents.company_id = :company_id', {
            company_id,
          });
        }
      } else {
        // if (type && (type = PurchaseRequestType.only_user)) {
        //   query.andWhere('document_approver.user_id = :user_id', {
        //     user_id,
        //   });
        // }
        switch (type) {
          case PurchaseRequestType.only_user:
            query.andWhere('document_approver.user_id = :user_id', {
              user_id,
            });
            break;

          case PurchaseRequestType.all:
            query.andWhere(
              `departments_approver.id IN (
                SELECT du.department_id
                FROM department_users du
                WHERE du.user_id = :user_id
              )`,
              { user_id },
            );
            break;
        }
      }
    }

    return query;
  }

  private getFilterOptions(): FilterOptions {
    return {
      searchColumns: ['receipts.receipt_number', 'receipts.account_code'],
      dateColumn: 'receipts.receipt_date',
      filterByColumns: ['documents.department_id'],
    };
  }

  /**
   * ==> Applies date filter to the query builder if dateColumn and date are provided.
   */
  private applyDateFilter(
    queryBuilder: any, // Replace 'any' with your actual QueryBuilder type
    dateColumn: string | undefined,
    date?: string,
  ) {
    if (dateColumn && date) {
      queryBuilder.andWhere(`${dateColumn} BETWEEN :dateStart AND :dateEnd`, {
        dateStart: `${date} 00:00:00`,
        dateEnd: `${date} 23:59:59`,
      });
    }
  }

  async findOne(
    id: ReceiptId,
    manager: EntityManager,
  ): Promise<ResponseResult<ReceiptEntity>> {
    const item = await this.createBaseQuery(manager)
      .where('receipts.id = :id', { id: id.value })
      .getOneOrFail();

    const user_approval_step = await manager
      .createQueryBuilder(UserApprovalStepOrmEntity, 'steps')
      .innerJoin('steps.user_approvals', 'user_approvals')
      .where('user_approvals.document_id = :id', { id: item.document_id })
      .getCount();

    const workflow_step = await manager
      .createQueryBuilder(ApprovalWorkflowStepOrmEntity, 'steps')
      .innerJoin('steps.approval_workflows', 'approval_workflows')
      .where('approval_workflows.document_type_id = :id', {
        id: item.documents.document_type_id,
      })
      .getCount();

    const step = workflow_step - user_approval_step;

    return this._dataAccessMapper.toEntity(item, step);
  }

  async getPrint(
    id: ReceiptId,
    query: ReceiptQueryDto,
    manager: EntityManager,
  ): Promise<ReceiptPrintResult> {
    const receipt = await this.createBaseQuery(manager)
      .where('receipts.id = :id', { id: id.value })
      .getOneOrFail();

    if (query.print === PrintEnum.ABOUT_RECEIPT) {
      return {
        receipt: await this._dataAccessMapper.toEntity(receipt),
        purchase_order: null,
        purchase_request: null,
      };
    }

    const [purchase_order, purchase_request] = await Promise.all([
      this.createBasePurchaseOrderQuery(manager)
        .where('purchase_orders.id = :id', { id: receipt.purchase_orders.id })
        .getOneOrFail(),
      this.createBasePurchaseRequestQuery(manager)
        .where('purchase_requests.id = :id', {
          id: receipt.purchase_orders.purchase_requests.id,
        })
        .getOneOrFail(),
    ]);

    return {
      receipt: await this._dataAccessMapper.toEntity(receipt),
      purchase_order:
        await this._purchaseOrderDataAccessMapper.toEntity(purchase_order),
      purchase_request:
        await this._purchaseRequestDataAccessMapper.toEntity(purchase_request),
    };
  }

  async countItem(
    user_id: number,
    manager: EntityManager,
  ): Promise<ResponseResult<{ amount: number }>> {
    const result = await manager
      .createQueryBuilder(ReceiptOrmEntity, 'receipts')
      .innerJoin('receipts.documents', 'documents')
      .innerJoin('documents.user_approvals', 'user_approvals')
      .innerJoin('user_approvals.user_approval_steps', 'user_approval_steps')
      .innerJoin(
        'user_approval_steps.document_approvers',
        'document_approver',
        'document_approver.user_approval_step_id = user_approval_steps.id',
      )
      .leftJoin('user_approval_steps.status', 'status')
      .leftJoin('document_approver.users', 'doc_approver_user')
      .leftJoin('doc_approver_user.department_users', 'doc_dept_user')
      .leftJoin('doc_dept_user.departments', 'departments_approver')
      .where('document_approver.user_id = :user_id', { user_id })
      .andWhere('status.id = :id', { id: 1 })
      .select('COUNT(user_approval_steps.id)', 'amount')
      .getRawOne<{ amount: string }>();

    return { amount: Number(result?.amount) };
  }
}
