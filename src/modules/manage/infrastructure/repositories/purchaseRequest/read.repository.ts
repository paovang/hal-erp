import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PAGINATION_SERVICE } from '@src/common/constants/inject-key.const';
import { PurchaseRequestOrmEntity } from '@src/common/infrastructure/database/typeorm/purchase-request.orm';
import {
  FilterOptions,
  IPaginationService,
  ResponseResult,
} from '@src/common/infrastructure/pagination/pagination.interface';
import { PurchaseRequestQueryDto } from '@src/modules/manage/application/dto/query/purchase-request.dto';
import { PurchaseRequestEntity } from '@src/modules/manage/domain/entities/purchase-request.entity';
import { IReadPurchaseRequestRepository } from '@src/modules/manage/domain/ports/output/purchase-request-repository.interface';
import { EntityManager, Repository } from 'typeorm';
import { PurchaseRequestDataAccessMapper } from '../../mappers/purchase-request.mapper';
import { PurchaseRequestId } from '../../../domain/value-objects/purchase-request-id.vo';
import {
  selectApprover,
  selectApproverUserSignatures,
  selectCompany,
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
  selectPositionApprover,
  selectPositions,
  selectPurchaseRequestItems,
  selectStatus,
  selectUnits,
  selectUserApprovals,
  selectUserApprovalSteps,
  selectUsers,
  selectUserSignatures,
  // selectWorkflowStepsDepartment,
} from '@src/common/constants/select-field';
import countStatusAmounts from '@src/common/utils/status-amount.util';
import {
  EligiblePersons,
  EnumPrOrPo,
} from '@src/modules/manage/application/constants/status-key.const';
import { ApprovalWorkflowStepOrmEntity } from '@src/common/infrastructure/database/typeorm/approval-workflow-step.orm';
import { UserApprovalStepOrmEntity } from '@src/common/infrastructure/database/typeorm/user-approval-step.orm';

@Injectable()
export class ReadPurchaseRequestRepository
  implements IReadPurchaseRequestRepository
{
  constructor(
    @InjectRepository(PurchaseRequestOrmEntity)
    private readonly _purchaseRequestOrm: Repository<PurchaseRequestOrmEntity>,
    private readonly _dataAccessMapper: PurchaseRequestDataAccessMapper,
    @Inject(PAGINATION_SERVICE)
    private readonly _paginationService: IPaginationService,
  ) {}

  /**
   * Find all
   * @param query
   * @param manager
   * @param departmentId
   * @param user_id
   * @param roles
   * @returns
   */
  async findAll(
    query: PurchaseRequestQueryDto,
    manager: EntityManager,
    departmentId?: number,
    user_id?: number,
    roles?: string[],
    company_id?: number,
  ): Promise<ResponseResult<PurchaseRequestEntity>> {
    const filterOptions = this.getFilterOptions();
    const queryBuilder = await this.createBaseQuery(
      manager,
      departmentId,
      user_id,
      roles,
      company_id,
    );
    query.sort_by = 'purchase_requests.id';

    // Date filtering (single date)
    this.applyDateFilter(queryBuilder, filterOptions.dateColumn, query.date);

    const status = await countStatusAmounts(
      manager,
      EnumPrOrPo.PR,
      user_id,
      roles,
      company_id,
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

  /**
   * Create base query
   * @param manager
   * @param departmentId
   * @param user_id
   * @param roles
   * @returns
   */
  private createBaseQuery(
    manager: EntityManager,
    departmentId?: number,
    user_id?: number,
    roles?: string[],
    company_id?: number,
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
      .innerJoin('documents.company', 'company')
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
      .leftJoin('document_approver.users', 'doc_approver_user')
      .leftJoin('doc_approver_user.department_users', 'doc_dept_user')
      .leftJoin('doc_dept_user.departments', 'departments_approver')
      .addSelect(selectFields);

    if (
      roles &&
      !roles.includes(EligiblePersons.SUPER_ADMIN) &&
      !roles.includes(EligiblePersons.ADMIN)
    ) {
      console.log('object', roles);
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
        query.andWhere('document_approver.user_id = :user_id', {
          user_id,
        });
      }
    }

    return query;
  }

  /**
   * Get filter options
   */
  private getFilterOptions(): FilterOptions {
    return {
      searchColumns: ['purchase_requests.pr_number', 'documents.title'],
      dateColumn: 'purchase_requests.requested_date',
      filterByColumns: [
        'documents.document_type_id',
        'user_approvals.status_id',
      ],
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

  /**
   * Find one
   * @param id
   * @param manager
   * @returns
   */
  async findOne(
    id: PurchaseRequestId,
    manager: EntityManager,
  ): Promise<ResponseResult<PurchaseRequestEntity>> {
    const item = await this.createBaseQuery(manager)
      .where('purchase_requests.id = :id', { id: id.value })
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
      .createQueryBuilder(PurchaseRequestOrmEntity, 'purchase_requests')
      .innerJoin('purchase_requests.documents', 'documents')
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
