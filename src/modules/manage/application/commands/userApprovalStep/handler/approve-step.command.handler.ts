import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { ApproveStepCommand } from '../approve-step.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { UserApprovalStepEntity } from '@src/modules/manage/domain/entities/user-approval-step.entity';
import { HttpStatus, Inject } from '@nestjs/common';
import {
  WRITE_DOCUMENT_APPROVER_REPOSITORY,
  WRITE_USER_APPROVAL_REPOSITORY,
  WRITE_USER_APPROVAL_STEP_REPOSITORY,
} from '../../../constants/inject-key.const';
import { IWriteUserApprovalStepRepository } from '@src/modules/manage/domain/ports/output/user-approval-step-repository.interface';
import { UserApprovalStepDataMapper } from '../../../mappers/user-approval-step.mapper';
import { UserContextService } from '@src/common/infrastructure/cls/cls.service';
import { UserApprovalStepOrmEntity } from '@src/common/infrastructure/database/typeorm/user-approval-step.orm';
import { ApprovalWorkflowStepOrmEntity } from '@src/common/infrastructure/database/typeorm/approval-workflow-step.orm';
import { STATUS_KEY } from '../../../constants/status-key.const';
import { ApprovalDto } from '../../../dto/create/userApprovalStep/update-statue.dto';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { UserApprovalDataMapper } from '../../../mappers/user-approval.mapper';
import { IWriteUserApprovalRepository } from '@src/modules/manage/domain/ports/output/user-approval-repository.interface';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { UserApprovalId } from '@src/modules/manage/domain/value-objects/user-approval-id.vo';
import { UserApprovalOrmEntity } from '@src/common/infrastructure/database/typeorm/user-approval.orm';
import { DocumentApproverOrmEntity } from '@src/common/infrastructure/database/typeorm/document-approver.orm';
import { TRANSACTION_MANAGER_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';
import { ApprovalWorkflowOrmEntity } from '@src/common/infrastructure/database/typeorm/approval-workflow.orm';
import { DocumentOrmEntity } from '@src/common/infrastructure/database/typeorm/document.orm';
import { IWriteDocumentApproverRepository } from '@src/modules/manage/domain/ports/output/document-approver-repository.interface';
import { DocumentApproverDataMapper } from '../../../mappers/document-approver.mapper';
import { BudgetApprovalRuleOrmEntity } from '@src/common/infrastructure/database/typeorm/budget-approval-rule.orm';
import { PurchaseRequestOrmEntity } from '@src/common/infrastructure/database/typeorm/purchase-request.orm';
import { handleApprovalStep } from '@src/common/utils/approval-step.utils';
import { UserApprovalStepId } from '@src/modules/manage/domain/value-objects/user-approval-step-id.vo';

interface CustomApprovalDto extends ApprovalDto {
  user_approval_id: number;
  approval_workflow_step_id: number;
  statusId: number;
  step_number: number;
}

interface UpdateUserApprovalStatusDto {
  status: number;
}

@CommandHandler(ApproveStepCommand)
export class ApproveStepCommandHandler
  implements
    IQueryHandler<ApproveStepCommand, ResponseResult<UserApprovalStepEntity>>
{
  constructor(
    @Inject(WRITE_USER_APPROVAL_STEP_REPOSITORY)
    private readonly _write: IWriteUserApprovalStepRepository,
    private readonly _dataMapper: UserApprovalStepDataMapper,
    @Inject(WRITE_USER_APPROVAL_REPOSITORY)
    private readonly _writeUA: IWriteUserApprovalRepository,
    private readonly _dataUAMapper: UserApprovalDataMapper,
    private readonly _userContextService: UserContextService,
    // document approver
    @Inject(WRITE_DOCUMENT_APPROVER_REPOSITORY)
    private readonly _writeDocumentApprover: IWriteDocumentApproverRepository,
    private readonly _dataDocumentApproverMapper: DocumentApproverDataMapper,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
  ) {}

  async execute(
    query: ApproveStepCommand,
  ): Promise<ResponseResult<UserApprovalStepEntity>> {
    const result = await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        const user = this._userContextService.getAuthUser()?.user;
        const user_id = user?.id;

        if (isNaN(query.stepId)) {
          throw new ManageDomainException(
            'errors.must_be_number',
            HttpStatus.BAD_REQUEST,
          );
        }

        const step = await manager.findOne(UserApprovalStepOrmEntity, {
          where: { id: query.stepId },
          relations: ['user_approvals', 'user_approvals.documents'],
        });

        if (!step) {
          throw new ManageDomainException(
            'errors.not_found',
            HttpStatus.NOT_FOUND,
          );
        }

        if (step.status_id === STATUS_KEY.APPROVED) {
          throw new ManageDomainException(
            'errors.already_approved',
            HttpStatus.BAD_REQUEST,
          );
        }

        const documentApprover = await manager.findOne(
          DocumentApproverOrmEntity,
          {
            where: { user_id: user_id, user_approval_step_id: step.id },
          },
        );

        if (!documentApprover) {
          throw new ManageDomainException(
            'errors.not_found',
            HttpStatus.NOT_FOUND,
          );
        }

        // Update current step to APPROVED
        const approvedStepEntity = this._dataMapper.toEntity(
          query.dto,
          user_id,
          query.stepId,
        );
        await approvedStepEntity.initializeUpdateSetId(
          new UserApprovalStepId(step.id),
        );
        await approvedStepEntity.validateExistingIdForUpdate();

        await findOneOrFail(query.manager, UserApprovalStepOrmEntity, {
          id: approvedStepEntity.getId().value,
        });

        await this._write.update(approvedStepEntity, manager, query.stepId);

        const document = await manager.findOne(DocumentOrmEntity, {
          where: { id: step.user_approvals.document_id },
        });

        if (!document) {
          throw new ManageDomainException(
            'errors.not_found',
            HttpStatus.NOT_FOUND,
          );
        }

        const approvalWorkflow = await manager.findOne(
          ApprovalWorkflowOrmEntity,
          {
            where: { document_type_id: document.document_type_id },
          },
        );

        if (!approvalWorkflow) {
          throw new ManageDomainException(
            'errors.not_found',
            HttpStatus.NOT_FOUND,
          );
        }

        // Determine current step number safely
        const currentStepNumber = step?.step_number ?? 0;

        let a_w_s = await manager.findOne(ApprovalWorkflowStepOrmEntity, {
          where: {
            approval_workflow_id: approvalWorkflow.id,
            step_number: currentStepNumber + 1,
          },
        });

        if (!a_w_s) {
          a_w_s = await manager.findOne(ApprovalWorkflowStepOrmEntity, {
            where: {
              approval_workflow_id: approvalWorkflow.id,
              step_number: currentStepNumber + 2,
            },
          });
        }

        if (a_w_s) {
          const pendingDto: CustomApprovalDto = {
            user_approval_id: step.user_approvals.id,
            approval_workflow_step_id: a_w_s.id,
            statusId: STATUS_KEY.PENDING,
            remark: null,
            step_number: a_w_s.step_number ?? 0,
          };

          const pendingEntity = this._dataMapper.toEntityForInsert(pendingDto);
          const userApprovalStep = await this._write.create(
            pendingEntity,
            manager,
          );

          const user_approval_step_id = (userApprovalStep as any)._id._value;

          const pr = await manager.findOne(PurchaseRequestOrmEntity, {
            where: { document_id: step.user_approvals.document_id },
            relations: ['purchase_request_items'],
          });
          if (!pr) {
            throw new ManageDomainException(
              'errors.not_found',
              HttpStatus.NOT_FOUND,
            );
          }

          const total = pr.purchase_request_items.reduce(
            (sum, item) => sum + (item.total_price || 0),
            0,
          );

          await handleApprovalStep({
            a_w_s,
            total,
            user_id,
            user_approval_step_id,
            manager,
            dataDocumentApproverMapper: this._dataDocumentApproverMapper,
            writeDocumentApprover: this._writeDocumentApprover,
            getApprover: this.getApprover.bind(this),
          });
        }

        return approvedStepEntity;
      },
    );

    await this.checkDataAndUpdateUserApproval(query);

    return result;
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

  private async checkDataAndUpdateUserApproval(
    query: ApproveStepCommand,
  ): Promise<void> {
    const PendingStep = await query.manager.findOne(UserApprovalStepOrmEntity, {
      where: {
        id: query.stepId,
      },
    });

    const remainingPendingStep = await query.manager.findOne(
      UserApprovalStepOrmEntity,
      {
        where: {
          user_approval_id: PendingStep?.user_approval_id,
          status_id: STATUS_KEY.PENDING,
        },
      },
    );

    if (!remainingPendingStep) {
      const updateStatusDto: UpdateUserApprovalStatusDto = {
        status: STATUS_KEY.APPROVED,
      };

      const finalApprovalEntity =
        this._dataUAMapper.toEntityUpdate(updateStatusDto);
      await finalApprovalEntity.initializeUpdateSetId(
        new UserApprovalId(PendingStep!.user_approval_id!),
      );
      await finalApprovalEntity.validateExistingIdForUpdate();

      await findOneOrFail(query.manager, UserApprovalOrmEntity, {
        id: finalApprovalEntity.getId().value,
      });

      await this._writeUA.update(finalApprovalEntity, query.manager);
    }
  }
}
