import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseOrderOrmEntity } from '@src/common/infrastructure/database/typeorm/purchase-order.orm';
import {
  FilterOptions,
  IPaginationService,
  ResponseResult,
} from '@src/common/infrastructure/pagination/pagination.interface';
import { PurchaseOrderQueryDto } from '@src/modules/manage/application/dto/query/purchase-order.dto';
import { PurchaseOrderEntity } from '@src/modules/manage/domain/entities/purchase-order.entity';
import { IReadPurchaseOrderRepository } from '@src/modules/manage/domain/ports/output/purchase-order-repository.interface';
import { EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { PurchaseOrderDataAccessMapper } from '../../mappers/purchase-order.mapper';
import { PAGINATION_SERVICE } from '@src/common/constants/inject-key.const';
import {
  selectApprovalWorkflowSteps,
  selectApprover,
  selectApproverUserSignatures,
  selectBudgetItemDetails,
  selectCurrencies,
  selectCurrency,
  selectDepartments,
  selectDepartmentUsers,
  selectDocuments,
  selectDocumentStatuses,
  selectDocumentTypes,
  selectPoDepartments,
  selectPoDepartmentUsers,
  selectPoDocuments,
  selectPoDocumentTypes,
  selectPoPositions,
  selectPositions,
  selectPoUsers,
  selectPoUserSignatures,
  selectProvinces,
  selectPurchaseOrderItems,
  selectPurchaseOrderSelectedVendors,
  selectPurchaseRequestItems,
  selectPurchaseRequests,
  selectQuotes,
  selectQuotesVendorBankAccounts,
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
  selectVendors,
  selectWorkflowStepsDepartment,
} from '@src/common/constants/select-field';
import { PurchaseOrderId } from '@src/modules/manage/domain/value-objects/purchase-order-id.vo';

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
  ): Promise<ResponseResult<PurchaseOrderEntity>> {
    const queryBuilder = await this.createBaseQuery(manager);
    query.sort_by = 'purchase_orders.id';

    const data = await this._paginationService.paginate(
      queryBuilder,
      query,
      this._dataAccessMapper.toEntity.bind(this._dataAccessMapper),
      this.getFilterOptions(),
    );
    return data;
  }

  private createBaseQuery(manager: EntityManager) {
    const selectFields = [
      ...selectPurchaseOrderItems,
      ...selectPurchaseOrderSelectedVendors,
      ...selectQuotes,
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
      ...selectBudgetItemDetails,
      ...selectProvinces,
      ...selectVendors,
      ...selectQuotesVendorBankAccounts,
      ...selectCurrencies,
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

      ...selectApprovalWorkflowSteps,
      ...selectWorkflowStepsDepartment,
    ];

    // return (
    //   manager
    //     .createQueryBuilder(PurchaseOrderOrmEntity, 'purchase_orders')
    // .leftJoin(
    //   'purchase_orders.purchase_order_items',
    //   'purchase_order_items',
    // )
    // .innerJoin(
    //   'purchase_orders.purchase_order_selected_vendors',
    //   'purchase_order_selected_vendors',
    // )
    // .innerJoin('purchase_order_items.purchase_order_item_quotes', 'quotes')
    // .innerJoin('purchase_orders.purchase_requests', 'purchase_requests')
    // .innerJoin(
    //   'purchase_requests.purchase_request_items',
    //   'purchase_request_items',
    // )
    // .innerJoin('purchase_requests.documents', 'documents')
    // .leftJoin('documents.departments', 'departments')
    // .leftJoin('documents.users', 'users')
    // .innerJoin('documents.document_types', 'document_types')
    // .innerJoin('users.user_signatures', 'user_signatures')
    // .leftJoin('users.department_users', 'department_users')
    // .innerJoin('department_users.positions', 'positions')

    // .innerJoin('purchase_request_items.units', 'units')
    // // purchase_order_items join with purchase request
    // .innerJoin(
    //   'purchase_order_items.purchase_request_items',
    //   'request_items',
    // )
    // .innerJoin('request_items.units', 'request_item_unit')
    // .leftJoin(
    //   'purchase_order_items.budget_item_details',
    //   'budget_item_details',
    // )
    // .leftJoin('budget_item_details.provinces', 'provinces')
    // // join with vendor
    // .innerJoin('quotes.vendors', 'vendors')
    // .innerJoin(
    //   'vendors.vendor_bank_accounts',
    //   'quotes_vendor_bank_accounts',
    // )
    // .innerJoin('quotes_vendor_bank_accounts.currencies', 'currencies')
    // .innerJoin(
    //   'purchase_order_selected_vendors.vendors',
    //   'selected_vendors',
    // )
    // .innerJoin(
    //   'selected_vendors.vendor_bank_accounts',
    //   'vendor_bank_accounts',
    // )
    // .innerJoin('vendor_bank_accounts.currencies', 'currency')

    // .innerJoin('purchase_orders.documents', 'po_documents')
    // .leftJoin('po_documents.departments', 'po_departments')
    // .innerJoin('po_documents.users', 'po_users')
    // .innerJoin('po_documents.document_types', 'po_document_types')
    // .innerJoin('po_users.user_signatures', 'po_user_signatures')
    // .innerJoin('po_users.department_users', 'po_department_users')
    // .innerJoin('po_department_users.positions', 'po_positions')

    // .innerJoin('po_documents.user_approvals', 'user_approvals')
    // .leftJoin('user_approvals.document_statuses', 'document_statuses')
    // .leftJoin('user_approvals.user_approval_steps', 'user_approval_steps')
    // .leftJoin('user_approval_steps.approver', 'approver')
    // .leftJoin('user_approval_steps.status', 'status')
    // .leftJoin('approver.user_signatures', 'approver_user_signatures')
    // .leftJoin(
    //   'user_approval_steps.approval_workflow_steps',
    //   'approval_workflow_steps',
    // )
    // .leftJoin(
    //   'approval_workflow_steps.departments',
    //   'workflow_steps_department',
    // )

    //     // add select
    //     .addSelect(selectFields)
    // );

    const queryBuilder = manager.createQueryBuilder(
      PurchaseOrderOrmEntity,
      'purchase_orders',
    );

    return this.joinBaseRelations(queryBuilder).addSelect(selectFields);
  }

  private getFilterOptions(): FilterOptions {
    return {
      searchColumns: [],
      dateColumn: '',
      filterByColumns: [],
    };
  }

  async findOne(
    id: PurchaseOrderId,
    manager: EntityManager,
  ): Promise<ResponseResult<PurchaseOrderEntity>> {
    const item = await this.createBaseQuery(manager)
      .where('purchase_orders.id = :id', { id: id.value })
      .getOneOrFail();

    return this._dataAccessMapper.toEntity(item);
  }

  private joinBaseRelations(qb: SelectQueryBuilder<any>) {
    return (
      qb
        .innerJoin(
          'purchase_orders.purchase_order_items',
          'purchase_order_items',
        )
        .innerJoin(
          'purchase_orders.purchase_order_selected_vendors',
          'purchase_order_selected_vendors',
        )
        .innerJoin('purchase_order_items.purchase_order_item_quotes', 'quotes')
        .innerJoin('purchase_orders.purchase_requests', 'purchase_requests')
        .innerJoin(
          'purchase_requests.purchase_request_items',
          'purchase_request_items',
        )
        .innerJoin('purchase_requests.documents', 'documents')
        .innerJoin('documents.departments', 'departments')
        .innerJoin('documents.users', 'users')
        .innerJoin('documents.document_types', 'document_types')
        .innerJoin('users.user_signatures', 'user_signatures')
        .innerJoin('users.department_users', 'department_users')
        .innerJoin('department_users.positions', 'positions')

        .innerJoin('purchase_request_items.units', 'units')
        // purchase_order_items join with purchase request
        .innerJoin(
          'purchase_order_items.purchase_request_items',
          'request_items',
        )
        .innerJoin('request_items.units', 'request_item_unit')
        .leftJoin(
          'purchase_order_items.budget_item_details',
          'budget_item_details',
        )
        .leftJoin('budget_item_details.provinces', 'provinces')
        // join with vendor
        .innerJoin('quotes.vendors', 'vendors')
        .leftJoin('vendors.vendor_bank_accounts', 'quotes_vendor_bank_accounts')
        .leftJoin('quotes_vendor_bank_accounts.currencies', 'currencies')
        .leftJoin('purchase_order_selected_vendors.vendors', 'selected_vendors')
        .leftJoin(
          'selected_vendors.vendor_bank_accounts',
          'vendor_bank_accounts',
        )
        .leftJoin('vendor_bank_accounts.currencies', 'currency')

        .innerJoin('purchase_orders.documents', 'po_documents')
        .innerJoin('po_documents.departments', 'po_departments')
        .innerJoin('po_documents.users', 'po_users')
        .innerJoin('po_documents.document_types', 'po_document_types')
        .innerJoin('po_users.user_signatures', 'po_user_signatures')
        .innerJoin('po_users.department_users', 'po_department_users')
        .innerJoin('po_department_users.positions', 'po_positions')

        .innerJoin('po_documents.user_approvals', 'user_approvals')
        .innerJoin('user_approvals.document_statuses', 'document_statuses')
        .leftJoin('user_approvals.user_approval_steps', 'user_approval_steps')
        .leftJoin('user_approval_steps.approver', 'approver')
        .leftJoin('user_approval_steps.status', 'status')
        .leftJoin('approver.user_signatures', 'approver_user_signatures')
        .leftJoin(
          'user_approval_steps.approval_workflow_steps',
          'approval_workflow_steps',
        )
        .leftJoin(
          'approval_workflow_steps.departments',
          'workflow_steps_department',
        )
    );
  }
}
