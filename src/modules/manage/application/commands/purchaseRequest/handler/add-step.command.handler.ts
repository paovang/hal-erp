import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { PurchaseRequestEntity } from '@src/modules/manage/domain/entities/purchase-request.entity';
import { Inject, HttpStatus } from '@nestjs/common';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import {
  WRITE_DOCUMENT_APPROVER_REPOSITORY,
  WRITE_DOCUMENT_REPOSITORY,
  WRITE_PURCHASE_REQUEST_REPOSITORY,
  WRITE_USER_APPROVAL_REPOSITORY,
  WRITE_USER_APPROVAL_STEP_REPOSITORY,
} from '../../../constants/inject-key.const';
import { IWritePurchaseRequestRepository } from '@src/modules/manage/domain/ports/output/purchase-request-repository.interface';
import { PurchaseRequestDataMapper } from '../../../mappers/purchase-request.mapper';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { PurchaseRequestOrmEntity } from '@src/common/infrastructure/database/typeorm/purchase-request.orm';
import { CodeGeneratorUtil } from '@src/common/utils/code-generator.util';
import { TRANSACTION_MANAGER_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';
import { UserContextService } from '@src/common/infrastructure/cls/cls.service';
import { IWriteDocumentRepository } from '@src/modules/manage/domain/ports/output/document-repository.interface';
import { DocumentDataMapper } from '../../../mappers/document.mapper';
import { UserApprovalDataMapper } from '../../../mappers/user-approval.mapper';
import { IWriteUserApprovalRepository } from '@src/modules/manage/domain/ports/output/user-approval-repository.interface';
import { ApprovalWorkflowOrmEntity } from '@src/common/infrastructure/database/typeorm/approval-workflow.orm';
import { ApprovalWorkflowStepOrmEntity } from '@src/common/infrastructure/database/typeorm/approval-workflow-step.orm';
import { IWriteUserApprovalStepRepository } from '@src/modules/manage/domain/ports/output/user-approval-step-repository.interface';
import { UserApprovalStepDataMapper } from '../../../mappers/user-approval-step.mapper';
import { ApprovalDto } from '../../../dto/create/userApprovalStep/update-statue.dto';
import {
  EnumDocumentStatus,
  EnumPrOrPo,
  EnumRequestApprovalType,
  STATUS_KEY,
} from '../../../constants/status-key.const';
import { CreateUserApprovalDto } from '../../../dto/create/userApproval/create.dto';
import { BudgetApprovalRuleOrmEntity } from '@src/common/infrastructure/database/typeorm/budget-approval-rule.orm';
import { handleApprovalStep } from '@src/common/utils/approval-step.utils';
import { IWriteDocumentApproverRepository } from '@src/modules/manage/domain/ports/output/document-approver-repository.interface';
import { DocumentApproverDataMapper } from '../../../mappers/document-approver.mapper';
import { AddStepCommand } from '../add-setp.command';
import { verifyOtp } from '@src/common/utils/server/verify-otp.util';
import { ApproveStepCommand } from '../../userApprovalStep/approve-step.command';
import { DocumentId } from '@src/modules/manage/domain/value-objects/document-id.vo';
import { PurchaseRequestId } from '@src/modules/manage/domain/value-objects/purchase-request-id.vo';
import { DocumentOrmEntity } from '@src/common/infrastructure/database/typeorm/document.orm';
import { sendApprovalRequest } from '@src/common/utils/server/send-data.uitl';
import { DepartmentUserOrmEntity } from '@src/common/infrastructure/database/typeorm/department-user.orm';
import { DepartmentOrmEntity } from '@src/common/infrastructure/database/typeorm/department.orm';

interface CustomApprovalDto
  extends Omit<
    ApprovalDto,
    'type' | 'files' | 'purchase_order_items' | 'otp' | 'approval_id'
  > {
  user_approval_id: number;
  requires_file_upload: boolean;
  step_number: number;
  is_otp: boolean;
}

interface CustomUserApprovalDto extends CreateUserApprovalDto {
  status: number;
}

@CommandHandler(AddStepCommand)
export class AddStepCommandHandler
  implements
    IQueryHandler<AddStepCommand, ResponseResult<PurchaseRequestEntity>>
{
  constructor(
    @Inject(WRITE_PURCHASE_REQUEST_REPOSITORY)
    private readonly _write: IWritePurchaseRequestRepository,
    private readonly _dataMapper: PurchaseRequestDataMapper,
    private readonly _codeGeneratorUtil: CodeGeneratorUtil,
    // document
    @Inject(WRITE_DOCUMENT_REPOSITORY)
    private readonly _writeD: IWriteDocumentRepository,
    private readonly _dataDMapper: DocumentDataMapper,
    // user approval
    @Inject(WRITE_USER_APPROVAL_REPOSITORY)
    private readonly _writeUserApproval: IWriteUserApprovalRepository,
    private readonly _dataUserApprovalMapper: UserApprovalDataMapper,
    // user approval step
    @Inject(WRITE_USER_APPROVAL_STEP_REPOSITORY)
    private readonly _writeUserApprovalStep: IWriteUserApprovalStepRepository,
    private readonly _dataUserApprovalMapperStep: UserApprovalStepDataMapper,
    // document approver
    @Inject(WRITE_DOCUMENT_APPROVER_REPOSITORY)
    private readonly _writeDocumentApprover: IWriteDocumentApproverRepository,
    private readonly _dataDocumentApproverMapper: DocumentApproverDataMapper,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
    private readonly _userContextService: UserContextService,
  ) {}

  async execute(
    query: AddStepCommand,
  ): Promise<ResponseResult<PurchaseRequestEntity>> {
    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        const user = this._userContextService.getAuthUser()?.user;
        const user_id = user.id;

        const department = await findOneOrFail(
          manager,
          DepartmentUserOrmEntity,
          {
            user_id: user_id,
          },
        );

        const department_id = (department as any).department_id;

        const get_department_name = await findOneOrFail(
          manager,
          DepartmentOrmEntity,
          {
            id: department_id,
          },
        );

        const department_name = (get_department_name as any).name;

        const pr = await query.manager.findOne(PurchaseRequestOrmEntity, {
          where: { id: query.id },
          relations: ['documents', 'purchase_request_items'],
        });

        if (!pr) {
          throw new ManageDomainException(
            'errors.not_found',
            HttpStatus.NOT_FOUND,
            { property: 'purchase request' },
          );
        }

        const pr_entity = this._dataMapper.toEntity(query.dto);

        // Set and validate ID
        await pr_entity.initializeUpdateSetId(
          new PurchaseRequestId(query.id ?? 0),
        );
        await pr_entity.validateExistingIdForUpdate();

        const document_id = pr?.document_id;
        const documentTypeId = pr?.documents.document_type_id;
        const document_status = EnumDocumentStatus.SUCCESS;

        const document_entity =
          this._dataDMapper.toEntityUpdate(document_status);

        // Set and validate ID
        await document_entity.initializeUpdateSetId(
          new DocumentId(document_id ?? 0),
        );
        await document_entity.validateExistingIdForUpdate();

        // Final existence check for ID before update
        await findOneOrFail(manager, DocumentOrmEntity, {
          id: document_entity.getId().value,
        });

        await this._writeD.update(document_entity, manager);

        const approval_workflow = await findOneOrFail(
          manager,
          ApprovalWorkflowOrmEntity,
          {
            document_type_id: documentTypeId,
          },
        );

        const aw_id = (approval_workflow as any).id;

        const a_w_s = await query.manager.findOne(
          ApprovalWorkflowStepOrmEntity,
          {
            where: { approval_workflow_id: aw_id },
            order: { step_number: 'ASC' },
          },
        );

        const merge: CustomUserApprovalDto = {
          documentId: document_id ?? 0,
          status: STATUS_KEY.PENDING,
        };

        const user_approval_entity =
          this._dataUserApprovalMapper.toEntity(merge);

        const user_approval = await this._writeUserApproval.create(
          user_approval_entity,
          manager,
        );

        const ua_id = (user_approval as any)._id._value;

        const pendingDto: CustomApprovalDto = {
          user_approval_id: ua_id,
          step_number: a_w_s?.step_number ?? 1,
          statusId: STATUS_KEY.PENDING,
          remark: null,
          requires_file_upload: a_w_s!.requires_file_upload, // assert that it is not null or undefined
          is_otp: a_w_s!.is_otp,
        };
        const aw_step =
          this._dataUserApprovalMapperStep.toEntityForInsert(pendingDto);
        const user_approval_step = await this._writeUserApprovalStep.create(
          aw_step,
          manager,
        );

        const user_approval_step_id = (user_approval_step as any)._id._value;

        const total =
          pr?.purchase_request_items?.reduce((sum, item) => {
            return sum + (item.total_price || 0);
          }, 0) || 0;

        let tel = user?.tel ? String(user.tel).trim() : '';

        if (!tel.match(/^\d+$/)) {
          throw new Error('Invalid tel: must contain digits only');
        }

        if (!tel.startsWith('20')) {
          tel = '20' + tel;
        }

        const data: ApproveStepCommand = {
          stepId: user_approval_step_id,
          dto: {
            approval_id: query.dto.approval_id,
            otp: query.dto.otp,
            statusId: STATUS_KEY.PENDING, // add this property
            is_otp: a_w_s!.is_otp, // add this property
            type: EnumPrOrPo.PR, // add this property
            purchase_order_items: [], // add this property
          },
          manager: manager,
        };

        await verifyOtp(data, 'approved', tel);

        const titles = pr?.purchase_request_items
          .map((item) => item.title)
          .join(', ');

        // send approval request server to server
        // await sendApprovalRequest(
        //   user_approval_step_id,
        //   total,
        //   user,
        //   user_id,
        //   department_name,
        //   EnumRequestApprovalType.PR,
        //   titles,
        // );

        // await handleApprovalStep({
        //   a_w_s,
        //   total,
        //   user_id,
        //   user_approval_step_id,
        //   manager,
        //   dataDocumentApproverMapper: this._dataDocumentApproverMapper,
        //   writeDocumentApprover: this._writeDocumentApprover,
        //   getApprover: this.getApprover.bind(this),
        // });

        return pr_entity;
      },
    );
  }

  private async getApprover(
    sum_total: number,
    manager: EntityManager,
  ): Promise<BudgetApprovalRuleOrmEntity[]> {
    const budgetApprovalRule = await manager
      .getRepository(BudgetApprovalRuleOrmEntity)
      .createQueryBuilder('rule')
      .where(':sum_total BETWEEN rule.min_amount AND rule.max_amount', {
        sum_total,
      })
      .getMany();

    if (budgetApprovalRule.length > 0) {
      return budgetApprovalRule;
    } else {
      throw new ManageDomainException(
        'errors.set_budget_approver_rule',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
