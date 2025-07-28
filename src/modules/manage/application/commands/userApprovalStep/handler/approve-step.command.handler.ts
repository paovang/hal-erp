import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { ApproveStepCommand } from '../approve-step.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { UserApprovalStepEntity } from '@src/modules/manage/domain/entities/user-approval-step.entity';
import { HttpStatus, Inject } from '@nestjs/common';
import {
  // SLIP_FOLDER,
  WRITE_DOCUMENT_APPROVER_REPOSITORY,
  // WRITE_DOCUMENT_ATTACHMENT_REPOSITORY,
  // WRITE_RECEIPT_REPOSITORY,
  WRITE_USER_APPROVAL_REPOSITORY,
  WRITE_USER_APPROVAL_STEP_REPOSITORY,
} from '../../../constants/inject-key.const';
import { IWriteUserApprovalStepRepository } from '@src/modules/manage/domain/ports/output/user-approval-step-repository.interface';
import { UserApprovalStepDataMapper } from '../../../mappers/user-approval-step.mapper';
import { UserContextService } from '@src/common/infrastructure/cls/cls.service';
import { UserApprovalStepOrmEntity } from '@src/common/infrastructure/database/typeorm/user-approval-step.orm';
import { ApprovalWorkflowStepOrmEntity } from '@src/common/infrastructure/database/typeorm/approval-workflow-step.orm';
import { EnumPrOrPo, STATUS_KEY } from '../../../constants/status-key.const';
import { ApprovalDto } from '../../../dto/create/userApprovalStep/update-statue.dto';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { UserApprovalDataMapper } from '../../../mappers/user-approval.mapper';
import { IWriteUserApprovalRepository } from '@src/modules/manage/domain/ports/output/user-approval-repository.interface';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { UserApprovalId } from '@src/modules/manage/domain/value-objects/user-approval-id.vo';
import { UserApprovalOrmEntity } from '@src/common/infrastructure/database/typeorm/user-approval.orm';
import { DocumentApproverOrmEntity } from '@src/common/infrastructure/database/typeorm/document-approver.orm';
import {
  TRANSACTION_MANAGER_SERVICE,
  USER_PROFILE_IMAGE_FILE_OPTIMIZE_SERVICE_KEY,
} from '@src/common/constants/inject-key.const';
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
// import { IWriteReceiptRepository } from '@src/modules/manage/domain/ports/output/receipt-repository.interface';
// import { ReceiptDataMapper } from '../../../mappers/receipt.mapper';
import { ReceiptOrmEntity } from '@src/common/infrastructure/database/typeorm/receipt.orm';
import { IImageOptimizeService } from '@src/common/utils/services/images/interface/image-optimize-service.interface';
import { AMAZON_S3_SERVICE_KEY } from '@src/common/infrastructure/aws3/config/inject-key';
import { IAmazonS3ImageService } from '@src/common/infrastructure/aws3/interface/amazon-s3-image-service.interface';
import { PurchaseOrderOrmEntity } from '@src/common/infrastructure/database/typeorm/purchase-order.orm';
// import path from 'path';
// import { createMockMulterFile } from '@src/common/utils/services/file-utils.service';
// import { ReceiptId } from '@src/modules/manage/domain/value-objects/receitp-id.vo';
// import { IWriteDocumentAttachmentRepository } from '@src/modules/manage/domain/ports/output/document-attachment.interface';

interface CustomApprovalDto extends Omit<ApprovalDto, 'type' | 'files'> {
  user_approval_id: number;
  approval_workflow_step_id: number;
  statusId: number;
  step_number: number;
  requires_file_upload: boolean;
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
    // @Inject(WRITE_DOCUMENT_ATTACHMENT_REPOSITORY)
    // private readonly _writeDocumentAttachment: IWriteDocumentAttachmentRepository,
    // private readonly _dataDocumentAttachmentMapper: DocumentAttachmentDataMapper,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
    @Inject(USER_PROFILE_IMAGE_FILE_OPTIMIZE_SERVICE_KEY)
    private readonly _optimizeService: IImageOptimizeService,
    @Inject(AMAZON_S3_SERVICE_KEY)
    private readonly _amazonS3ServiceKey: IAmazonS3ImageService,
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

        // if (step.requires_file_upload === true) {
        //   const document_id = step.user_approvals.document_id;
        //   await this.uploadFile(query, manager, document_id!);
        // }
        console.log('user', user_id);
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
            requires_file_upload: a_w_s.requires_file_upload,
          };

          const pendingEntity = this._dataMapper.toEntityForInsert(pendingDto);
          const userApprovalStep = await this._write.create(
            pendingEntity,
            manager,
          );

          const user_approval_step_id = (userApprovalStep as any)._id._value;

          let total = 0;
          if (query.dto.type === EnumPrOrPo.PR) {
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

            total = pr.purchase_request_items.reduce(
              (sum, item) => sum + (item.total_price || 0),
              0,
            );
          } else if (query.dto.type === EnumPrOrPo.PO) {
            const po = await manager.findOne(PurchaseOrderOrmEntity, {
              where: { document_id: step.user_approvals.document_id },
              relations: ['purchase_order_items'],
            });
            if (!po) {
              throw new ManageDomainException(
                'errors.not_found',
                HttpStatus.NOT_FOUND,
              );
            }

            total = po.purchase_order_items.reduce(
              (sum, item) => sum + (item.total || 0),
              0,
            );
          } else if (query.dto.type === EnumPrOrPo.R) {
            const receipt = await manager.findOne(ReceiptOrmEntity, {
              where: { document_id: step.user_approvals.document_id },
              relations: ['receipt_items'],
            });
            if (!receipt) {
              throw new ManageDomainException(
                'errors.not_found',
                HttpStatus.NOT_FOUND,
              );
            }

            total = receipt.receipt_items.reduce(
              (sum, item) => sum + (item.total || 0),
              0,
            );
          }

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

  // private async uploadFile(
  //   query: ApproveStepCommand,
  //   manager: EntityManager,
  //   document_id: number,
  // ): Promise<void> {
  //   if (!query.dto.files) {
  //     throw new ManageDomainException(
  //       'errors.file_name_required',
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }

  //   for (const file of query.dto.files) {
  //     if (!file.file_name) {
  //       throw new ManageDomainException(
  //         'errors.file_name_required',
  //         HttpStatus.BAD_REQUEST,
  //       );
  //     }
  //     const fileKey: string | null = null;

  //     const baseFolder = path.join(
  //       __dirname,
  //       '../../../../../../../assets/uploads/',
  //     );

  //     const mockFile = await createMockMulterFile(baseFolder, file.file_name);
  //     const optimizedImage =
  //       await this._optimizeService.optimizeImage(mockFile);
  //     const s3ImageResponse = await this._amazonS3ServiceKey.uploadFile(
  //       optimizedImage,
  //       SLIP_FOLDER,
  //     );

  //     // fileKey = s3ImageResponse.fileKey;

  //     // // const set_data: ReceiptInterface = { slip: fileKey };

  //     // // Update slip in the step
  //     // const receiptEntity = this._dataReceiptMapper.toEntity(set_data);
  //     // await receiptEntity.initializeUpdateSetId(new ReceiptId(find_receipt.id));
  //     // await receiptEntity.validateExistingIdForUpdate();

  //     // await findOneOrFail(query.manager, ReceiptOrmEntity, {
  //     //   id: receiptEntity.getId().value,
  //     // });

  //     // await this._writeReceipt.update(receiptEntity, manager);
  //   }
  // }
}
