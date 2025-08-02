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
import { EntityManager, Repository } from 'typeorm';
import { PurchaseOrderDataAccessMapper } from '../../mappers/purchase-order.mapper';
import { PAGINATION_SERVICE } from '@src/common/constants/inject-key.const';
import {
  // selectApprovalWorkflowSteps,
  selectApprover,
  selectApproverUserSignatures,
  // selectCurrencies,
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
  selectPurchaseOrderItems,
  selectPurchaseOrderSelectedVendors,
  selectPurchaseRequestItems,
  selectPurchaseRequests,
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
  // selectVendors,
  // selectWorkflowStepsDepartment,
} from '@src/common/constants/select-field';
import { PurchaseOrderId } from '@src/modules/manage/domain/value-objects/purchase-order-id.vo';
import countStatusAmounts from '@src/common/utils/status-amount.util';
import {
  EligiblePersons,
  EnumPrOrPo,
} from '@src/modules/manage/application/constants/status-key.const';

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
  ): Promise<ResponseResult<PurchaseOrderEntity>> {
    const queryBuilder = await this.createBaseQuery(manager, roles, user_id);
    query.sort_by = 'purchase_orders.id';

    const status = await countStatusAmounts(
      manager,
      EnumPrOrPo.PO,
      user_id,
      roles,
    );

    const data = await this._paginationService.paginate(
      queryBuilder,
      query,
      this._dataAccessMapper.toEntity.bind(this._dataAccessMapper),
      this.getFilterOptions(),
    );
    return {
      ...data,
      status: status,
    };
  }

  private createBaseQuery(
    manager: EntityManager,
    roles?: string[],
    user_id?: number,
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
      // ...selectBudgetItemDetails,
      // ...selectProvinces,
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
      // .leftJoin(
      //   'purchase_order_items.budget_item_details',
      //   'budget_item_details',
      // )
      // .leftJoin('budget_item_details.provinces', 'provinces')
      .innerJoin('purchase_order_selected_vendors.vendors', 'selected_vendors')
      // .leftJoin('selected_vendors.vendor_bank_accounts', 'vendor_bank_accounts')
      .leftJoin(
        'purchase_order_selected_vendors.vendor_bank_account',
        'vendor_bank_accounts',
      )
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
      .innerJoin('user_approval_steps.status', 'status')
      .leftJoin('approver.user_signatures', 'approver_user_signatures')
      .innerJoin(
        'user_approval_steps.document_approvers',
        'document_approver',
        'document_approver.user_approval_step_id = user_approval_steps.id',
      )
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

    return query;

    // const queryBuilder = manager.createQueryBuilder(
    //   PurchaseOrderOrmEntity,
    //   'purchase_orders',
    // );

    // return this.joinBaseRelations(queryBuilder).addSelect(selectFields);
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

    return this._dataAccessMapper.toEntity(item);
  }
}
