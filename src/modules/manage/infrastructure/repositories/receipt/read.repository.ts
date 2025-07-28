import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PAGINATION_SERVICE } from '@src/common/constants/inject-key.const';
import { ReceiptOrmEntity } from '@src/common/infrastructure/database/typeorm/receipt.orm';
import {
  FilterOptions,
  IPaginationService,
  ResponseResult,
} from '@src/common/infrastructure/pagination/pagination.interface';
import { IReadReceiptRepository } from '@src/modules/manage/domain/ports/output/receipt-repository.interface';
import { EntityManager, Repository } from 'typeorm';
import { ReceiptDataAccessMapper } from '../../mappers/receipt.mapper';
import { ReceiptQueryDto } from '@src/modules/manage/application/dto/query/receipt.dto';
import { ReceiptEntity } from '@src/modules/manage/domain/entities/receipt.entity';
import {
  EligiblePersons,
  EnumPrOrPo,
} from '@src/modules/manage/application/constants/status-key.const';
import {
  selectApprover,
  selectApproverUserSignatures,
  selectCreatedBy,
  selectCurrencies,
  selectCurrency,
  selectDepartments,
  selectDepartmentUsers,
  selectDocumentAttachments,
  selectDocuments,
  selectDocumentStatuses,
  selectDocumentTypes,
  selectPositions,
  selectReceiptBy,
  selectReceiptItems,
  selectStatus,
  selectUserApprovals,
  selectUserApprovalSteps,
  selectUsers,
} from '@src/common/constants/select-field';
import countStatusAmounts from '@src/common/utils/status-amount.util';
import { ReceiptId } from '@src/modules/manage/domain/value-objects/receitp-id.vo';

@Injectable()
export class ReadReceiptRepository implements IReadReceiptRepository {
  constructor(
    @InjectRepository(ReceiptOrmEntity)
    private readonly _receiptOrm: Repository<ReceiptOrmEntity>,
    private readonly _dataAccessMapper: ReceiptDataAccessMapper,
    @Inject(PAGINATION_SERVICE)
    private readonly _paginationService: IPaginationService,
  ) {}
  async findAll(
    query: ReceiptQueryDto,
    manager: EntityManager,
    user_id?: number,
    roles?: string[],
  ): Promise<ResponseResult<ReceiptEntity>> {
    const queryBuilder = await this.createBaseQuery(manager, user_id, roles);
    query.sort_by = 'receipts.id';

    const status = await countStatusAmounts(
      manager,
      EnumPrOrPo.R,
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
    user_id?: number,
    roles?: string[],
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
    ];

    const query = manager
      .createQueryBuilder(ReceiptOrmEntity, 'receipts')
      .innerJoin('receipts.documents', 'documents')
      .innerJoin('documents.departments', 'departments')
      .innerJoin('documents.users', 'users')
      .innerJoin('documents.document_types', 'document_types')
      .innerJoin('users.department_users', 'department_users')
      .innerJoin('department_users.positions', 'positions')
      .innerJoin('receipts.users', 'receipt_by')
      .innerJoin('receipts.receipt_items', 'receipt_items')
      .innerJoin('receipt_items.currency', 'currency')
      .innerJoin('receipt_items.payment_currency', 'currencies')
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
      .leftJoin('user_approval_steps.status', 'status')
      .leftJoin('approver.user_signatures', 'approver_user_signatures')
      .leftJoin('documents.document_attachments', 'document_attachments')
      .leftJoin('document_attachments.users', 'created_by')
      .addSelect(selectFields);

    if (
      roles &&
      !roles.includes(EligiblePersons.SUPER_ADMIN) &&
      !roles.includes(EligiblePersons.ADMIN)
    ) {
      console.log('user_id', user_id);
      query.andWhere('document_approver.user_id = :user_id', { user_id });
    }

    return query;
  }

  private getFilterOptions(): FilterOptions {
    return {
      searchColumns: ['receipts.pr_number'],
      dateColumn: '',
      filterByColumns: ['receipts.receipt_date', 'documents.department_id'],
    };
  }

  async findOne(
    id: ReceiptId,
    manager: EntityManager,
  ): Promise<ResponseResult<ReceiptEntity>> {
    const item = await this.createBaseQuery(manager)
      .where('receipts.id = :id', { id: id.value })
      .getOneOrFail();

    return this._dataAccessMapper.toEntity(item);
  }
}
