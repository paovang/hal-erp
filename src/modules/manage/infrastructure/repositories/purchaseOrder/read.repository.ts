import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseOrderOrmEntity } from '@src/common/infrastructure/database/typeorm/purchase-order.orm';
import {
  FilterOptions,
  IPaginationService,
  ResponseResult,
} from '@src/common/infrastructure/pagination/pagination.interface';
import { PurchaseOrderQueryDto } from '@src/modules/manage/application/dto/query/purchase-order.dto';
import { PurchaseOrderExportQueryDto } from '@src/modules/manage/application/dto/query/purchase-order-export.dto';
import { PurchaseOrderEntity } from '@src/modules/manage/domain/entities/purchase-order.entity';
import { IReadPurchaseOrderRepository } from '@src/modules/manage/domain/ports/output/purchase-order-repository.interface';
import { EntityManager, Repository } from 'typeorm';
import { PurchaseOrderDataAccessMapper } from '../../mappers/purchase-order.mapper';
import { PAGINATION_SERVICE } from '@src/common/constants/inject-key.const';
import {
  // selectApprovalWorkflowSteps,
  selectApprover,
  selectApproverUserSignatures,
  selectBanks,
  selectBudgetAccounts,
  selectBudgetItems,
  selectCompany,
  // selectCurrencies,
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
  selectProducts,
  selectPurchaseOrderItems,
  selectPurchaseOrderSelectedVendors,
  selectPurchaseRequestItems,
  selectPurchaseRequests,
  selectQuotaCompany,
  selectReceipt,
  // selectQuotesVendorBankAccounts,
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
  selectVendorProduct,
  selectVendors,
  // selectVendors,
  // selectWorkflowStepsDepartment,
} from '@src/common/constants/select-field';
import { PurchaseOrderId } from '@src/modules/manage/domain/value-objects/purchase-order-id.vo';
import countStatusAmounts from '@src/common/utils/status-amount.util';
import {
  EligiblePersons,
  EnumPrOrPo,
} from '@src/modules/manage/application/constants/status-key.const';
import { ApprovalWorkflowStepOrmEntity } from '@src/common/infrastructure/database/typeorm/approval-workflow-step.orm';
import { UserApprovalStepOrmEntity } from '@src/common/infrastructure/database/typeorm/user-approval-step.orm';
import { PurchaseRequestType } from '@src/modules/manage/application/dto/query/purchase-request.dto';

@Injectable()
export class ReadPurchaseOrderRepository
  implements IReadPurchaseOrderRepository
{
  constructor(
    @InjectRepository(PurchaseOrderOrmEntity)
    private readonly _purchaseOrderOrm: Repository<PurchaseOrderOrmEntity>,
    private readonly _dataAccessMapper: PurchaseOrderDataAccessMapper,
    @Inject(PAGINATION_SERVICE)
    private readonly _paginationService: IPaginationService,
  ) {}
  async findAll(
    query: PurchaseOrderQueryDto,
    manager: EntityManager,
    user_id?: number,
    roles?: string[],
    company_id?: number,
  ): Promise<ResponseResult<PurchaseOrderEntity>> {
    const filterCompanyId = Number(query.company_id);
    const queryBuilder = await this.createBaseQuery(
      manager,
      roles,
      user_id,
      company_id,
      query.type,
    );

    query.sort_by = 'purchase_orders.id';

    if (filterCompanyId) {
      queryBuilder.andWhere('po_documents.company_id = :filterCompanyId', {
        filterCompanyId,
      });
    }
    if (query.startDate && query.endDate) {
      queryBuilder.andWhere(
        'purchase_orders.created_at BETWEEN :startDate AND :endDate',
        {
          startDate: query.startDate,
          endDate: query.endDate,
        },
      );
    }

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const offset = (page - 1) * limit;

    const [idRoqs, totalRow] = await Promise.all([
      queryBuilder
        .clone()
        .select('purchase_orders.id', 'id')
        .groupBy('purchase_orders.id')
        .orderBy('purchase_orders.id', 'DESC')
        .limit(limit)
        .offset(offset)
        .getRawMany<{ id: number }>(),
      queryBuilder
        .clone()
        .select('COUNT(DISTINCT purchase_orders.id)', 'count')
        .getRawOne<{ count: number }>(),
    ]);
    const total = Number(totalRow?.count || 0);
    const ids = idRoqs.map((id) => id.id);

    let items: PurchaseOrderOrmEntity[] = [];

    if (ids.length > 0) {
      const fullQuery = await this.createBaseQuery(manager);
      items = await fullQuery
        .where('purchase_orders.id IN (:...ids)', { ids })
        .orderBy('purchase_orders.id', 'DESC')
        .getMany();
    }

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

    const status = await countStatusAmounts(
      manager,
      EnumPrOrPo.PO,
      user_id,
      roles,
      undefined,
      undefined,
      undefined,
      undefined,
      company_id,
      filterCompanyId,
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
  // async findAll(
  //   query: PurchaseOrderQueryDto,
  //   manager: EntityManager,
  //   user_id?: number,
  //   roles?: string[],
  //   company_id?: number,
  // ): Promise<ResponseResult<PurchaseOrderEntity>> {
  //   const filterCompanyId = Number(query.company_id);
  //   const queryBuilder = await this.createBaseQuery(
  //     manager,
  //     roles,
  //     user_id,
  //     company_id,
  //     query.type,
  //   );

  //   query.sort_by = 'purchase_orders.id';

  //   if (filterCompanyId) {
  //     queryBuilder.andWhere('po_documents.company_id = :filterCompanyId', {
  //       filterCompanyId,
  //     });
  //   }

  //   const status = await countStatusAmounts(
  //     manager,
  //     EnumPrOrPo.PO,
  //     user_id,
  //     roles,
  //     undefined,
  //     undefined,
  //     undefined,
  //     undefined,
  //     company_id,
  //     filterCompanyId,
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
  // async findAll(
  //   query: PurchaseOrderQueryDto,
  //   manager: EntityManager,
  //   user_id?: number,
  //   roles?: string[],
  //   company_id?: number,
  // ): Promise<ResponseResult<PurchaseOrderEntity>> {
  //   const filterCompanyId = Number(query.company_id);
  //   query.sort_by = 'purchase_orders.id';

  //   // --- Step 1: ดึง IDs ด้วย subquery ---
  //   const idQueryBuilder = await this.createBaseQuery(
  //     manager,
  //     roles,
  //     user_id,
  //     company_id,
  //     query.type,
  //   );

  //   if (filterCompanyId) {
  //     idQueryBuilder.andWhere('po_documents.company_id = :filterCompanyId', {
  //       filterCompanyId,
  //     });
  //   }

  //   const page = Number(query.page) || 1;
  //   const limit = Number(query.limit) || 10;
  //   const offset = (page - 1) * limit;
  //   const baseIdQuery = idQueryBuilder
  //     .select('purchase_orders.id', 'id')
  //     .groupBy('purchase_orders.id')
  //     .orderBy('purchase_orders.id', 'DESC');
  //   const [idRows, totalRow] = await Promise.all([
  //     baseIdQuery
  //       .clone()
  //       .limit(limit)
  //       .offset(offset)
  //       .getRawMany<{ id: number }>(),
  //     baseIdQuery
  //       .clone()
  //       .select('COUNT(DISTINCT purchase_orders.id)', 'count')
  //       .getRawOne<{ count: string }>(),
  //   ]);
  //   // ใช้ groupBy แทน DISTINCT เพื่อหลีกเลี่ยง PostgreSQL error
  //   const idRows = await idQueryBuilder
  //     .select('purchase_orders.id', 'id')
  //     .groupBy('purchase_orders.id')
  //     .orderBy('purchase_orders.id', 'DESC')
  //     .limit(limit)
  //     .offset(offset)
  //     .getRawMany<{ id: number }>();

  //   const totalRow = await idQueryBuilder
  //     .select('COUNT(DISTINCT purchase_orders.id)', 'count')
  //     .getRawOne<{ count: string }>();

  //   const total = Number(totalRow?.count ?? 0);
  //   const ids = idRows.map((r) => Number(r.id));

  //   // --- Step 2: Fetch ข้อมูลเต็มจาก IDs ---
  //   let items: PurchaseOrderOrmEntity[] = [];

  //   if (ids.length > 0) {
  //     const fullQuery = await this.createBaseQuery(manager); // ไม่ใส่ role filter ซ้ำ
  //     items = await fullQuery
  //       .where('purchase_orders.id IN (:...ids)', { ids })
  //       .orderBy('purchase_orders.id', 'DESC')
  //       .getMany();
  //   }

  //   // --- Step 3: Map พร้อมนับ approval steps ---
  //   const mappedItems = await Promise.all(
  //     items.map(async (item) => {
  //       const user_approval_step = await manager
  //         .createQueryBuilder(UserApprovalStepOrmEntity, 'steps')
  //         .innerJoin('steps.user_approvals', 'user_approvals')
  //         .where('user_approvals.document_id = :id', { id: item.document_id })
  //         .getCount();

  //       const workflow_step = await manager
  //         .createQueryBuilder(ApprovalWorkflowStepOrmEntity, 'steps')
  //         .innerJoin('steps.approval_workflows', 'approval_workflows')
  //         .where('approval_workflows.document_type_id = :id', {
  //           id: item.documents.document_type_id,
  //         })
  //         .getCount();

  //       const step = workflow_step - user_approval_step;
  //       return this._dataAccessMapper.toEntity(item, step);
  //     }),
  //   );

  //   // --- Step 4: Status amounts ---
  //   const status = await countStatusAmounts(
  //     manager,
  //     EnumPrOrPo.PO,
  //     user_id,
  //     roles,
  //     undefined,
  //     undefined,
  //     undefined,
  //     undefined,
  //     company_id,
  //     filterCompanyId,
  //   );
  //   return {
  //     status,
  //     pagination: {
  //       page,
  //       limit,
  //       total,
  //       total_pages: Math.ceil(total / limit),
  //     },
  //     data: mappedItems,
  //   };
  // }
  async findAllForExport(
    query: PurchaseOrderExportQueryDto,
    manager: EntityManager,
    user_id?: number,
    roles?: string[],
    company_id?: number,
  ): Promise<PurchaseOrderEntity[]> {
    const filterCompanyId = Number(query.company_id);

    const queryBuilder = this.createBaseQuery(
      manager,
      roles,
      user_id,
      company_id,
      query.type,
    );

    if (filterCompanyId) {
      queryBuilder.andWhere('po_documents.company_id = :filterCompanyId', {
        filterCompanyId,
      });
    }

    queryBuilder.andWhere(
      'purchase_orders.created_at BETWEEN :startDate AND :endDate',
      { startDate: query.startDate, endDate: query.endDate },
    );

    const items = await queryBuilder
      .orderBy('purchase_orders.id', 'DESC')
      .getMany();

    return Promise.all(
      items.map((item) => this._dataAccessMapper.toEntity(item, 0)),
    );
  }

  private createBaseQuery(
    manager: EntityManager,
    roles?: string[],
    user_id?: number,
    company_id?: number,
    type?: PurchaseRequestType,
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
      ...selectCompany,
      ...selectQuotaCompany,
      ...selectVendorProduct,
      ...selectProducts,
      ...selectVendors,
      ...selectReceipt,
      ...[
        'currencies.id',
        'currencies.code',
        'currencies.name',
        'currencies.created_at',
        'currencies.updated_at',
      ],
      ...[
        'pr_currency.id',
        'pr_currency.code',
        'pr_currency.name',
        'pr_currency.created_at',
        'pr_currency.updated_at',
      ],
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
      .leftJoin('purchase_order_items.currency', 'currencies')

      .innerJoin('purchase_request_items.units', 'units')

      .leftJoin('purchase_request_items.currency', 'pr_currency')

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

  private getFilterOptions(): FilterOptions {
    return {
      searchColumns: [],
      dateColumn: 'purchase_orders.order_date',
      filterByColumns: ['po_documents.department_id'],
    };
  }

  async findOne(
    id: PurchaseOrderId,
    manager: EntityManager,
  ): Promise<ResponseResult<PurchaseOrderEntity>> {
    const item = await this.createBaseQuery(manager)
      .where('purchase_orders.id = :id', { id: id.value })
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

  async countItem(
    user_id: number,
    manager: EntityManager,
  ): Promise<ResponseResult<{ amount: number }>> {
    // const count = await this.createBaseQuery(manager, undefined, user_id)
    //   .where('status.id = :id', { id: 1 })
    //   .getCount();
    // return { amount: count };

    const result = await manager
      .createQueryBuilder(PurchaseOrderOrmEntity, 'purchase_orders')
      .innerJoin('purchase_orders.documents', 'documents')
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
