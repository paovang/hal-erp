import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { ApproveStepCommand } from '../approve-step.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { UserApprovalStepEntity } from '@src/modules/manage/domain/entities/user-approval-step.entity';
import { HttpStatus, Inject } from '@nestjs/common';
import {
  FILE_FOLDER,
  LENGTH_DOCUMENT_TRANSACTION_CODE,
  READ_BUDGET_ITEM_REPOSITORY,
  WRITE_DOCUMENT_APPROVER_REPOSITORY,
  WRITE_DOCUMENT_ATTACHMENT_REPOSITORY,
  WRITE_DOCUMENT_TRANSACTION_REPOSITORY,
  WRITE_PURCHASE_ORDER_ITEM_REPOSITORY,
  WRITE_RECEIPT_REPOSITORY,
  WRITE_USER_APPROVAL_REPOSITORY,
  WRITE_USER_APPROVAL_STEP_REPOSITORY,
} from '../../../constants/inject-key.const';
import { IWriteUserApprovalStepRepository } from '@src/modules/manage/domain/ports/output/user-approval-step-repository.interface';
import { UserApprovalStepDataMapper } from '../../../mappers/user-approval-step.mapper';
import { UserContextService } from '@src/common/infrastructure/cls/cls.service';
import { UserApprovalStepOrmEntity } from '@src/common/infrastructure/database/typeorm/user-approval-step.orm';
import { ApprovalWorkflowStepOrmEntity } from '@src/common/infrastructure/database/typeorm/approval-workflow-step.orm';
import {
  EnumDocumentTransactionType,
  EnumPrOrPo,
  EnumRequestApprovalType,
  STATUS_KEY,
} from '../../../constants/status-key.const';
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
import { ReceiptOrmEntity } from '@src/common/infrastructure/database/typeorm/receipt.orm';
import { IImageOptimizeService } from '@src/common/utils/services/images/interface/image-optimize-service.interface';
import { AMAZON_S3_SERVICE_KEY } from '@src/common/infrastructure/aws3/config/inject-key';
import { IAmazonS3ImageService } from '@src/common/infrastructure/aws3/interface/amazon-s3-image-service.interface';
import { PurchaseOrderOrmEntity } from '@src/common/infrastructure/database/typeorm/purchase-order.orm';
import path from 'path';
import { createMockMulterFile } from '@src/common/utils/services/file-utils.service';
import { IWriteDocumentAttachmentRepository } from '@src/modules/manage/domain/ports/output/document-attachment.interface';
import { DocumentAttachmentDataMapper } from '../../../mappers/document-attachment.mapper';
import { DocumentAttachmentInterface } from '../interface/document-attachment.interface';
import { IWriteReceiptRepository } from '@src/modules/manage/domain/ports/output/receipt-repository.interface';
import { ReceiptDataMapper } from '../../../mappers/receipt.mapper';
import { ReceiptInterface } from '../../receipt/interface/receipt.interface';
import { ReceiptId } from '@src/modules/manage/domain/value-objects/receitp-id.vo';
import { IWritePurchaseOrderItemRepository } from '@src/modules/manage/domain/ports/output/purchase-order-item-repository.interface';
import { PurchaseOrderItemDataMapper } from '../../../mappers/purchase-order-item.mapper';
import { PurchaseOrderItemOrmEntity } from '@src/common/infrastructure/database/typeorm/purchase-order-item.orm';
import { PurchaseOrderItemId } from '@src/modules/manage/domain/value-objects/purchase-order-item-id.vo';
import { IWriteDocumentTransactionRepository } from '@src/modules/manage/domain/ports/output/document-transaction-repository.interface';
import {
  DocumentTransactionDataMapper,
  DocumentTransactionInterface,
} from '../../../mappers/document-transaction.mapper';
import { CodeGeneratorUtil } from '@src/common/utils/code-generator.util';
import { DocumentTransactionOrmEntity } from '@src/common/infrastructure/database/typeorm/document-transaction.orm';
import { BudgetItemOrmEntity } from '@src/common/infrastructure/database/typeorm/budget-item.orm';
import { DocumentStatusOrmEntity } from '@src/common/infrastructure/database/typeorm/document-statuse.orm';
import { IReadBudgetItemRepository } from '@src/modules/manage/domain/ports/output/budget-item-repository.interace';
import { verifyOtp } from '@src/common/utils/server/verify-otp.util';
import { sendApprovalRequest } from '@src/common/utils/server/send-data.uitl';
import { DepartmentUserOrmEntity } from '@src/common/infrastructure/database/typeorm/department-user.orm';
import { DepartmentOrmEntity } from '@src/common/infrastructure/database/typeorm/department.orm';

interface CustomApprovalDto
  extends Omit<
    ApprovalDto,
    'type' | 'files' | 'purchase_order_items' | 'otp' | 'approval_id' | 'select'
  > {
  user_approval_id: number;
  approval_workflow_step_id: number;
  statusId: number;
  step_number: number;
  requires_file_upload: boolean;
  is_otp: boolean;
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

    @Inject(WRITE_DOCUMENT_ATTACHMENT_REPOSITORY)
    private readonly _writeDocumentAttachment: IWriteDocumentAttachmentRepository,
    private readonly _dataDocumentAttachmentMapper: DocumentAttachmentDataMapper,

    @Inject(WRITE_RECEIPT_REPOSITORY)
    private readonly _writeReceipt: IWriteReceiptRepository,
    private readonly _dataReceiptMapper: ReceiptDataMapper,

    @Inject(WRITE_PURCHASE_ORDER_ITEM_REPOSITORY)
    private readonly _writePoItem: IWritePurchaseOrderItemRepository,
    private readonly _dataPoItemMapper: PurchaseOrderItemDataMapper,

    @Inject(WRITE_DOCUMENT_TRANSACTION_REPOSITORY)
    private readonly _writeTransaction: IWriteDocumentTransactionRepository,
    private readonly _dataTransactionMapper: DocumentTransactionDataMapper,

    @Inject(READ_BUDGET_ITEM_REPOSITORY)
    private readonly _readBudget: IReadBudgetItemRepository,

    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
    @Inject(USER_PROFILE_IMAGE_FILE_OPTIMIZE_SERVICE_KEY)
    private readonly _optimizeService: IImageOptimizeService,
    @Inject(AMAZON_S3_SERVICE_KEY)
    private readonly _amazonS3ServiceKey: IAmazonS3ImageService,
    private readonly _codeGeneratorUtil: CodeGeneratorUtil,
  ) {}

  async execute(
    query: ApproveStepCommand,
  ): Promise<ResponseResult<UserApprovalStepEntity>> {
    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        const user = this._userContextService.getAuthUser()?.user;
        const user_id = user?.id;
        const roles = user?.roles?.map((r: any) => r.name) ?? [];

        if (isNaN(query.stepId)) {
          throw new ManageDomainException(
            'errors.must_be_number',
            HttpStatus.BAD_REQUEST,
            { property: `${query.stepId}` },
          );
        }

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

        const DocumentStatus = await findOneOrFail(
          manager,
          DocumentStatusOrmEntity,
          {
            id: query.dto.statusId,
          },
        );

        const status = (DocumentStatus as any).name;
        let tel = user?.tel ? String(user.tel).trim() : '';

        if (!tel.match(/^\d+$/)) {
          throw new Error('Invalid tel: must contain digits only');
        }

        if (!tel.startsWith('20')) {
          tel = '20' + tel;
        }

        const step = await manager.findOne(UserApprovalStepOrmEntity, {
          where: { id: query.stepId },
          relations: ['user_approvals', 'user_approvals.documents'],
        });

        if (!step) {
          throw new ManageDomainException(
            'errors.not_found',
            HttpStatus.NOT_FOUND,
            { property: 'user approval step' },
          );
        }

        if (step.status_id === STATUS_KEY.APPROVED) {
          throw new ManageDomainException(
            'errors.already_approved',
            HttpStatus.BAD_REQUEST,
          );
        }

        if (step.is_otp === true) {
          // Verify OTP
          await verifyOtp(query, status, tel);
        }

        if (step.requires_file_upload === true) {
          const document_id = step.user_approvals.document_id;
          await this.uploadFile(query, manager, document_id!, user_id);
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
            { property: 'document approver' },
          );
        }

        if (query.dto.statusId === STATUS_KEY.APPROVED) {
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
              { property: 'document' },
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
              { property: 'approval workflow' },
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
              is_otp: a_w_s.is_otp,
            };

            const pendingEntity =
              this._dataMapper.toEntityForInsert(pendingDto);
            const userApprovalStep = await this._write.create(
              pendingEntity,
              manager,
            );

            const user_approval_step_id = (userApprovalStep as any)._id._value;
            let total = 0;

            if (query.dto.type === EnumPrOrPo.PR) {
              // get pr data
              const purchase_request = await manager.findOne(
                PurchaseRequestOrmEntity,
                {
                  where: { document_id: step.user_approvals.document_id },
                  relations: ['purchase_request_items'],
                },
              );

              if (!purchase_request) {
                throw new ManageDomainException(
                  'errors.not_found',
                  HttpStatus.NOT_FOUND,
                  { property: 'purchase request' },
                );
              }

              const titles = purchase_request.purchase_request_items
                .map((item) => item.title)
                .filter(Boolean);

              const titlesString = titles.join(', ');
              // end

              total = purchase_request.purchase_request_items.reduce(
                (sum, item) => sum + (item.total_price || 0),
                0,
              );

              if (a_w_s.is_otp === true) {
                // send approval request server to server
                await sendApprovalRequest(
                  user_approval_step_id,
                  total,
                  user,
                  user_id,
                  department_name,
                  EnumRequestApprovalType.PR,
                  titlesString,
                );
              }
            } else if (query.dto.type === EnumPrOrPo.PO) {
              const po = await manager.findOne(PurchaseOrderOrmEntity, {
                where: { document_id: step.user_approvals.document_id },
                relations: [
                  'purchase_order_items',
                  'purchase_order_items.purchase_request_items',
                ],
              });
              if (!po) {
                throw new ManageDomainException(
                  'errors.not_found',
                  HttpStatus.NOT_FOUND,
                  { property: 'purchase order' },
                );
              }

              const titlesString = po.purchase_order_items
                .flatMap((item) => item.purchase_request_items)
                .map((prItem) => prItem.title)
                .join(', ');

              if (
                roles.includes('budget-admin') ||
                roles.includes('budget-user')
              ) {
                let sum_total = 0;
                for (const item of query.dto.purchase_order_items) {
                  await findOneOrFail(manager, PurchaseOrderItemOrmEntity, {
                    id: item.id,
                  });

                  await findOneOrFail(manager, BudgetItemOrmEntity, {
                    id: item.budget_item_id,
                  });

                  const allBudgetItemIds = query.dto.purchase_order_items.map(
                    (item) => item.budget_item_id,
                  );

                  // Check if all values in the array are the same
                  const [firstBudgetItemId, ...rest] = allBudgetItemIds;
                  if (rest.every((id) => id === firstBudgetItemId)) {
                    const get_total = await this._readBudget.getTotal(
                      item.id,
                      manager,
                    );

                    sum_total += get_total;
                  } else {
                    const get_total = await this._readBudget.getTotal(
                      item.id,
                      manager,
                    );

                    sum_total = get_total;
                  }

                  const check_budget = await this._readBudget.calculate(
                    item.budget_item_id,
                    manager,
                  );

                  if (sum_total > check_budget) {
                    throw new ManageDomainException(
                      'errors.insufficient_budget',
                      HttpStatus.BAD_REQUEST,
                      { property: `${check_budget}` },
                    );
                  }
                  const itemId = item.id;

                  const POEntity =
                    this._dataPoItemMapper.toEntityForUpdate(item);

                  // Set and validate ID
                  await POEntity.initializeUpdateSetId(
                    new PurchaseOrderItemId(itemId),
                  );
                  await POEntity.validateExistingIdForUpdate();

                  // Final existence check for ID before update
                  await findOneOrFail(manager, PurchaseOrderItemOrmEntity, {
                    id: POEntity.getId().value,
                  });

                  await this._writePoItem.update(POEntity, manager);
                }
                if (a_w_s.is_otp === true) {
                  // send approval request server to server
                  await sendApprovalRequest(
                    user_approval_step_id,
                    total,
                    user,
                    user_id,
                    department_name,
                    EnumRequestApprovalType.PO,
                    titlesString,
                  );
                }
              }

              if (a_w_s.is_otp === true) {
                // send approval request server to server
                await sendApprovalRequest(
                  user_approval_step_id,
                  total,
                  user,
                  user_id,
                  department_name,
                  EnumRequestApprovalType.PO,
                  titlesString,
                );
              }

              total = po.purchase_order_items.reduce(
                (sum, item) => sum + (item.total || 0),
                0,
              );
            } else if (query.dto.type === EnumPrOrPo.R) {
              const receipt = await manager.findOne(ReceiptOrmEntity, {
                where: { document_id: step.user_approvals.document_id },
                relations: [
                  'receipt_items',
                  'receipt_items.purchase_order_items.purchase_request_items',
                ],
              });

              if (!receipt) {
                throw new ManageDomainException(
                  'errors.not_found',
                  HttpStatus.NOT_FOUND,
                  { property: 'receipt' },
                );
              }

              const titlesString = receipt.receipt_items
                .flatMap((receiptItem) => receiptItem.purchase_order_items)
                .flatMap((poItem) => poItem.purchase_request_items)
                .map((prItem) => prItem.title)
                .join(', ');

              if (
                roles.includes('account-admin') ||
                roles.includes('account-user')
              ) {
                if (!receipt.account_code) {
                  if (!query.dto.account_code) {
                    throw new ManageDomainException(
                      'errors.account_code_required',
                      HttpStatus.BAD_REQUEST,
                    );
                  }

                  await this.registerAccount(query, manager, receipt.id);
                } else {
                  await this.insertDataInTransaction(manager, receipt);
                }
              }

              total = receipt.receipt_items.reduce(
                (sum, item) => sum + (item.total || 0),
                0,
              );

              if (a_w_s.is_otp === true) {
                // send approval request server to server
                await sendApprovalRequest(
                  user_approval_step_id,
                  total,
                  user,
                  user_id,
                  department_name,
                  EnumRequestApprovalType.RC,
                  titlesString,
                );
              }
            } else {
              throw new ManageDomainException(
                'errors.not_found',
                HttpStatus.NOT_FOUND,
                { property: 'type' },
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

          // ກໍລະນິບໍ່ມິ step ຕໍ່ໄປແລ້ວ
          if (query.dto.type === EnumPrOrPo.PO) {
            const po = await manager.findOne(PurchaseOrderOrmEntity, {
              where: { document_id: step.user_approvals.document_id },
              relations: [
                'purchase_order_items',
                'purchase_order_items.purchase_request_items',
              ],
            });
            if (!po) {
              throw new ManageDomainException(
                'errors.not_found',
                HttpStatus.NOT_FOUND,
                { property: 'purchase order' },
              );
            }

            if (
              roles.includes('budget-admin') ||
              roles.includes('budget-user')
            ) {
              let sum_total = 0;
              for (const item of query.dto.purchase_order_items) {
                await findOneOrFail(manager, PurchaseOrderItemOrmEntity, {
                  id: item.id,
                });

                await findOneOrFail(manager, BudgetItemOrmEntity, {
                  id: item.budget_item_id,
                });

                const allBudgetItemIds = query.dto.purchase_order_items.map(
                  (item) => item.budget_item_id,
                );

                // Check if all values in the array are the same
                const [firstBudgetItemId, ...rest] = allBudgetItemIds;
                if (rest.every((id) => id === firstBudgetItemId)) {
                  const get_total = await this._readBudget.getTotal(
                    item.id,
                    manager,
                  );

                  sum_total += get_total;
                } else {
                  const get_total = await this._readBudget.getTotal(
                    item.id,
                    manager,
                  );

                  sum_total = get_total;
                }

                const check_budget = await this._readBudget.calculate(
                  item.budget_item_id,
                  manager,
                );

                if (sum_total > check_budget) {
                  throw new ManageDomainException(
                    'errors.insufficient_budget',
                    HttpStatus.BAD_REQUEST,
                    { property: `${check_budget}` },
                  );
                }
                const itemId = item.id;

                const POEntity = this._dataPoItemMapper.toEntityForUpdate(item);

                // Set and validate ID
                await POEntity.initializeUpdateSetId(
                  new PurchaseOrderItemId(itemId),
                );
                await POEntity.validateExistingIdForUpdate();

                // Final existence check for ID before update
                await findOneOrFail(manager, PurchaseOrderItemOrmEntity, {
                  id: POEntity.getId().value,
                });

                await this._writePoItem.update(POEntity, manager);
              }
            }
          } else if (query.dto.type === EnumPrOrPo.R) {
            const receipt = await manager.findOne(ReceiptOrmEntity, {
              where: { document_id: step.user_approvals.document_id },
              relations: [
                'receipt_items',
                'receipt_items.purchase_order_items.purchase_request_items',
              ],
            });

            if (!receipt) {
              throw new ManageDomainException(
                'errors.not_found',
                HttpStatus.NOT_FOUND,
                { property: 'receipt' },
              );
            }

            if (
              roles.includes('account-admin') ||
              roles.includes('account-user')
            ) {
              if (!receipt.account_code) {
                if (!query.dto.account_code) {
                  throw new ManageDomainException(
                    'errors.account_code_required',
                    HttpStatus.BAD_REQUEST,
                  );
                }

                await this.registerAccount(query, manager, receipt.id);
              } else {
                await this.insertDataInTransaction(manager, receipt);
              }
            }
          } else {
            throw new ManageDomainException(
              'errors.not_found',
              HttpStatus.NOT_FOUND,
              { property: 'type' },
            );
          }

          await this.checkDataAndUpdateUserApproval(query, manager);
          return approvedStepEntity;
        }

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

        await this.RejectUserApproval(query, manager);

        return approvedStepEntity;
      },
    );

    // return result;
  }

  private async RejectUserApproval(
    query: ApproveStepCommand,
    manager: EntityManager,
  ): Promise<void> {
    const PendingStep = await manager.findOne(UserApprovalStepOrmEntity, {
      where: {
        id: query.stepId,
      },
    });

    if (!PendingStep) {
      throw new ManageDomainException(
        'errors.not_found',
        HttpStatus.NOT_FOUND,
        { property: 'user approval step' },
      );
    }

    const updateStatusDto: UpdateUserApprovalStatusDto = {
      status: STATUS_KEY.REJECTED,
    };

    const finalApprovalEntity =
      this._dataUAMapper.toEntityUpdate(updateStatusDto);
    await finalApprovalEntity.initializeUpdateSetId(
      new UserApprovalId(PendingStep.user_approval_id!),
    );
    await finalApprovalEntity.validateExistingIdForUpdate();

    await findOneOrFail(manager, UserApprovalOrmEntity, {
      id: finalApprovalEntity.getId().value,
    });

    await this._writeUA.update(finalApprovalEntity, manager);
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
    manager: EntityManager,
  ): Promise<void> {
    const PendingStep = await manager.findOne(UserApprovalStepOrmEntity, {
      where: {
        id: query.stepId,
      },
    });

    if (!PendingStep) {
      throw new ManageDomainException(
        'errors.not_found',
        HttpStatus.NOT_FOUND,
        { property: 'user approval step' },
      );
    }

    const remainingPendingStep = await manager.findOne(
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

      await findOneOrFail(manager, UserApprovalOrmEntity, {
        id: finalApprovalEntity.getId().value,
      });

      await this._writeUA.update(finalApprovalEntity, manager);
    }
  }

  private async uploadFile(
    query: ApproveStepCommand,
    manager: EntityManager,
    document_id: number,
    user_id: number,
  ): Promise<void> {
    if (!query.dto.files) {
      throw new ManageDomainException(
        'errors.file_name_required',
        HttpStatus.BAD_REQUEST,
      );
    }

    for (const file of query.dto.files) {
      if (!file.file_name) {
        throw new ManageDomainException(
          'errors.file_name_required',
          HttpStatus.BAD_REQUEST,
        );
      }
      let fileKey: string | null = null;

      const baseFolder = path.join(
        __dirname,
        '../../../../../../../assets/uploads/',
      );

      const mockFile = await createMockMulterFile(baseFolder, file.file_name);
      const optimizedImage =
        await this._optimizeService.optimizeImage(mockFile);
      const s3ImageResponse = await this._amazonS3ServiceKey.uploadFile(
        optimizedImage,
        FILE_FOLDER,
      );

      fileKey = s3ImageResponse.fileKey;

      const set_data: DocumentAttachmentInterface = {
        document_id: document_id,
        file_name: fileKey,
        created_by: user_id,
      };

      // Update slip in the step
      const receiptEntity =
        this._dataDocumentAttachmentMapper.toEntity(set_data);

      await this._writeDocumentAttachment.create(receiptEntity, manager);
    }
  }

  private async registerAccount(
    query: ApproveStepCommand,
    manager: EntityManager,
    receiptId?: number,
  ): Promise<void> {
    const code: ReceiptInterface = {
      account_code: query.dto.account_code,
    };

    const receiptEntity = this._dataReceiptMapper.toEntity(code);

    // Set and validate ID
    await receiptEntity.initializeUpdateSetId(new ReceiptId(receiptId ?? 0));
    await receiptEntity.validateExistingIdForUpdate();

    // Final existence check for ID before update
    await findOneOrFail(manager, ReceiptOrmEntity, {
      id: receiptEntity.getId().value,
    });

    await this._writeReceipt.update(receiptEntity, manager);
  }

  private async generateDocumentTransactionNumber(
    manager: EntityManager,
  ): Promise<string> {
    return await this._codeGeneratorUtil.generateUniqueCode(
      LENGTH_DOCUMENT_TRANSACTION_CODE,
      async (generatedCode: string) => {
        try {
          await findOneOrFail(manager, DocumentTransactionOrmEntity, {
            transaction_number: generatedCode,
          });
          return false;
        } catch {
          return true;
        }
      },
      'TN',
    );
  }

  private async insertDataInTransaction(
    manager: EntityManager,
    receipt: ReceiptOrmEntity,
  ): Promise<void> {
    for (const item of receipt.receipt_items) {
      const poItem = item.purchase_order_items;

      // Ensure purchase order item exists
      if (!poItem || !poItem.budget_item_id) {
        throw new ManageDomainException(
          `errors.invalid_budget_item`,
          HttpStatus.BAD_REQUEST,
          { property: 'budget_item_detail_id' },
        );
      }

      // Find budget item detail
      const find_budget_item = await manager.findOne(BudgetItemOrmEntity, {
        where: {
          id: poItem.budget_item_id,
        },
      });

      if (!find_budget_item) {
        throw new ManageDomainException(
          'errors.not_found',
          HttpStatus.NOT_FOUND,
          { property: 'budget_item_detail_id' },
        );
      }

      // Generate transaction number
      const transactionNumber =
        await this.generateDocumentTransactionNumber(manager);

      // Prepare transaction data
      const transactionData: DocumentTransactionInterface = {
        document_id: receipt.document_id!,
        budget_item_detail_id: find_budget_item.id,
        transaction_number: transactionNumber,
        amount: item.total ?? 0,
        transaction_type: EnumDocumentTransactionType.COMMIT,
      };

      // Map and save transaction entity
      const transactionEntity =
        this._dataTransactionMapper.toEntity(transactionData);
      await this._writeTransaction.create(transactionEntity, manager);
    }
  }
}
