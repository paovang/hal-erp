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
  // selectApprovalWorkflowSteps,
  selectApprover,
  selectApproverUserSignatures,
  selectDepartments,
  selectDepartmentUsers,
  selectDocuments,
  selectDocumentStatuses,
  selectDocumentTypes,
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
  async findAll(
    query: PurchaseRequestQueryDto,
    manager: EntityManager,
    departmentId?: number,
    user_id?: number,
    roles?: string[],
  ): Promise<ResponseResult<PurchaseRequestEntity>> {
    const queryBuilder = await this.createBaseQuery(
      manager,
      departmentId,
      user_id,
      roles,
    );
    query.sort_by = 'purchase_requests.id';

    const status = await countStatusAmounts(
      manager,
      EnumPrOrPo.PR,
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
    departmentId?: number,
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

    return query;
  }

  private getFilterOptions(): FilterOptions {
    return {
      searchColumns: ['purchase_requests.pr_number', 'documents.title'],
      dateColumn: '',
      filterByColumns: [
        'documents.document_type_id',
        'user_approvals.status_id',
      ],
    };
  }

  async findOne(
    id: PurchaseRequestId,
    manager: EntityManager,
  ): Promise<ResponseResult<PurchaseRequestEntity>> {
    const item = await this.createBaseQuery(manager)
      .where('purchase_requests.id = :id', { id: id.value })
      .getOneOrFail();

    return this._dataAccessMapper.toEntity(item);
  }
}
