import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { CreateCommand } from '../create.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { PurchaseOrderEntity } from '@src/modules/manage/domain/entities/purchase-order.entity';
import { PurchaseOrderDataMapper } from '../../../mappers/purchase-order.mapper';
import { HttpStatus, Inject } from '@nestjs/common';
import {
  LENGTH_DOCUMENT_CODE,
  LENGTH_PURCHASE_ORDER_CODE,
  PO_FILE_NAME_FOLDER,
  WRITE_DOCUMENT_APPROVER_REPOSITORY,
  WRITE_DOCUMENT_REPOSITORY,
  WRITE_PURCHASE_ORDER_ITEM_REPOSITORY,
  WRITE_PURCHASE_ORDER_REPOSITORY,
  WRITE_PURCHASE_ORDER_SELECTED_VENDOR_REPOSITORY,
  WRITE_USER_APPROVAL_REPOSITORY,
  WRITE_USER_APPROVAL_STEP_REPOSITORY,
} from '../../../constants/inject-key.const';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { PurchaseRequestOrmEntity } from '@src/common/infrastructure/database/typeorm/purchase-request.orm';
import { IWritePurchaseOrderRepository } from '@src/modules/manage/domain/ports/output/purchase-order-repository.interface';
import { IWriteDocumentRepository } from '@src/modules/manage/domain/ports/output/document-repository.interface';
import { DocumentDataMapper } from '../../../mappers/document.mapper';
import { CodeGeneratorUtil } from '@src/common/utils/code-generator.util';
import {
  TRANSACTION_MANAGER_SERVICE,
  USER_PROFILE_IMAGE_FILE_OPTIMIZE_SERVICE_KEY,
} from '@src/common/constants/inject-key.const';
import { InjectDataSource } from '@nestjs/typeorm';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { DataSource, EntityManager, In } from 'typeorm';
import { UserContextService } from '@src/common/infrastructure/cls/cls.service';
import { IImageOptimizeService } from '@src/common/utils/services/images/interface/image-optimize-service.interface';
import { AMAZON_S3_SERVICE_KEY } from '@src/common/infrastructure/aws3/config/inject-key';
import { IAmazonS3ImageService } from '@src/common/infrastructure/aws3/interface/amazon-s3-image-service.interface';
import { DocumentOrmEntity } from '@src/common/infrastructure/database/typeorm/document.orm';
import { DepartmentUserOrmEntity } from '@src/common/infrastructure/database/typeorm/department-user.orm';
import { DocumentEntityMode } from '@src/common/utils/orm-entity-method.enum';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { PurchaseOrderOrmEntity } from '@src/common/infrastructure/database/typeorm/purchase-order.orm';
import { PurchaseOrderItemDataMapper } from '../../../mappers/purchase-order-item.mapper';
import { IWritePurchaseOrderItemRepository } from '@src/modules/manage/domain/ports/output/purchase-order-item-repository.interface';
import { PurchaseRequestItemOrmEntity } from '@src/common/infrastructure/database/typeorm/purchase-request-item.orm';
import path from 'path';
import { createMockMulterFile } from '@src/common/utils/services/file-utils.service';
import { PurchaseOrderSelectedVendorDataMapper } from '../../../mappers/purchase-order-selected-vendor.mapper';
import { IWritePurchaseOrderSelectedVendorRepository } from '@src/modules/manage/domain/ports/output/Purchase-order-selected-vendor-repository.interface';
import { VendorOrmEntity } from '@src/common/infrastructure/database/typeorm/vendor.orm';
import { IWriteUserApprovalRepository } from '@src/modules/manage/domain/ports/output/user-approval-repository.interface';
import { UserApprovalDataMapper } from '../../../mappers/user-approval.mapper';
import { IWriteUserApprovalStepRepository } from '@src/modules/manage/domain/ports/output/user-approval-step-repository.interface';
import { UserApprovalStepDataMapper } from '../../../mappers/user-approval-step.mapper';
import { STATUS_KEY } from '../../../constants/status-key.const';
import { CreateUserApprovalDto } from '../../../dto/create/userApproval/create.dto';
import { ApprovalDto } from '../../../dto/create/userApprovalStep/update-statue.dto';
import { ApprovalWorkflowOrmEntity } from '@src/common/infrastructure/database/typeorm/approval-workflow.orm';
import { ApprovalWorkflowStepOrmEntity } from '@src/common/infrastructure/database/typeorm/approval-workflow-step.orm';
import { BudgetApprovalRuleOrmEntity } from '@src/common/infrastructure/database/typeorm/budget-approval-rule.orm';
import { handleApprovalStep } from '@src/common/utils/approval-step.utils';
import { IWriteDocumentApproverRepository } from '@src/modules/manage/domain/ports/output/document-approver-repository.interface';
import { DocumentApproverDataMapper } from '../../../mappers/document-approver.mapper';
import { UserApprovalOrmEntity } from '@src/common/infrastructure/database/typeorm/user-approval.orm';
import { assertOrThrow } from '@src/common/utils/assert.util';
import { VendorBankAccountOrmEntity } from '@src/common/infrastructure/database/typeorm/vendor_bank_account.orm';

interface CustomPurchaseOrderItemDto {
  purchase_request_item_id: number;
  remark: string;
  price: number;
  quantity: number;
  total: number;
  is_vat: boolean;
}

interface CustomUserApprovalDto extends CreateUserApprovalDto {
  status: number;
}

interface CustomApprovalDto extends ApprovalDto {
  user_approval_id: number;
  step_number: number;
}

@CommandHandler(CreateCommand)
export class CreateCommandHandler
  implements IQueryHandler<CreateCommand, ResponseResult<PurchaseOrderEntity>>
{
  constructor(
    @Inject(WRITE_PURCHASE_ORDER_REPOSITORY)
    private readonly _write: IWritePurchaseOrderRepository,
    private readonly _dataMapper: PurchaseOrderDataMapper,
    // item
    @Inject(WRITE_PURCHASE_ORDER_ITEM_REPOSITORY)
    private readonly _writeItem: IWritePurchaseOrderItemRepository,
    private readonly _dataItemMapper: PurchaseOrderItemDataMapper,

    // document
    @Inject(WRITE_DOCUMENT_REPOSITORY)
    private readonly _writeD: IWriteDocumentRepository,
    private readonly _dataDMapper: DocumentDataMapper,

    // select vendor
    @Inject(WRITE_PURCHASE_ORDER_SELECTED_VENDOR_REPOSITORY)
    private readonly _writeSV: IWritePurchaseOrderSelectedVendorRepository,
    private readonly _dataSVMapper: PurchaseOrderSelectedVendorDataMapper,

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
    @Inject(USER_PROFILE_IMAGE_FILE_OPTIMIZE_SERVICE_KEY)
    private readonly _optimizeService: IImageOptimizeService,
    @Inject(AMAZON_S3_SERVICE_KEY)
    private readonly _amazonS3ServiceKey: IAmazonS3ImageService,
    private readonly _codeGeneratorUtil: CodeGeneratorUtil,
  ) {}

  async execute(
    query: CreateCommand,
  ): Promise<ResponseResult<PurchaseOrderEntity>> {
    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        const user_id = this._userContextService.getAuthUser()?.user.id;

        const department = await findOneOrFail(
          query.manager,
          DepartmentUserOrmEntity,
          {
            user_id: user_id,
          },
        );

        const pr = await manager.findOne(PurchaseRequestOrmEntity, {
          where: {
            id: query.dto.purchase_request_id,
          },
        });

        assertOrThrow(pr, 'errors.not_found', HttpStatus.NOT_FOUND);

        const checkDocumentApproval = await manager.findOne(
          UserApprovalOrmEntity,
          {
            where: {
              document_id: pr?.document_id,
              status_id: STATUS_KEY.APPROVED,
            },
          },
        );

        assertOrThrow(
          checkDocumentApproval,
          'errors.not_found',
          HttpStatus.NOT_FOUND,
        );

        const department_id = (department as any).department_id;

        const document_number =
          await this._codeGeneratorUtil.generateUniqueCode(
            LENGTH_DOCUMENT_CODE,
            async (generatedCode: string) => {
              try {
                await findOneOrFail(manager, DocumentOrmEntity, {
                  document_number: generatedCode,
                });
                return false;
              } catch {
                return true;
              }
            },
            'D',
          );

        const po_number = await this._codeGeneratorUtil.generateUniqueCode(
          LENGTH_PURCHASE_ORDER_CODE,
          async (generatedCode: string) => {
            try {
              await findOneOrFail(manager, PurchaseOrderOrmEntity, {
                po_number: generatedCode,
              });
              return false;
            } catch {
              return true;
            }
          },
          'PO',
        );

        const DEntity = this._dataDMapper.toEntity(
          query.dto.document,
          DocumentEntityMode.CREATE,
          document_number,
          user_id,
          department_id,
        );

        const D = await this._writeD.create(DEntity, manager);

        const document_id = (D as any)._id._value;

        const entity = this._dataMapper.toEntity(
          query.dto,
          document_id,
          pr!,
          po_number,
        );

        const po_result = await this._write.create(entity, manager);

        const po_id = (po_result as any)._id._value;
        // save po item
        await this.savePOItem(query, manager, po_id);

        const total = await this.calculateTotal(query, manager);

        // save user approval
        await this.saveUserApproval(
          query,
          manager,
          document_id,
          total,
          user_id,
        );

        return po_result;
      },
    );
  }

  private async saveUserApproval(
    query: CreateCommand,
    manager: EntityManager,
    document_id: number,
    total: number,
    user_id: number,
  ): Promise<void> {
    const approval_workflow = await findOneOrFail(
      manager,
      ApprovalWorkflowOrmEntity,
      {
        document_type_id: query.dto.document.documentTypeId,
      },
    );

    const aw_id = (approval_workflow as any).id;

    const a_w_s = await query.manager.findOne(ApprovalWorkflowStepOrmEntity, {
      where: { approval_workflow_id: aw_id },
      order: { step_number: 'ASC' },
    });

    const merge: CustomUserApprovalDto = {
      documentId: document_id,
      status: STATUS_KEY.PENDING,
    };

    const user_approval_entity = this._dataUserApprovalMapper.toEntity(merge);

    const user_approval = await this._writeUserApproval.create(
      user_approval_entity,
      manager,
    );

    const ua_id = (user_approval as any)._id._value;

    const pendingDto: CustomApprovalDto = {
      user_approval_id: ua_id,
      statusId: STATUS_KEY.PENDING,
      step_number: a_w_s?.step_number ?? 1,
      remark: null,
    };
    const aw_step =
      this._dataUserApprovalMapperStep.toEntityForInsert(pendingDto);
    const user_approval_step = await this._writeUserApprovalStep.create(
      aw_step,
      manager,
    );

    const user_approval_step_id = (user_approval_step as any)._id._value;

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

  private async saveSelectedVendor(
    query: CreateCommand,
    manager: EntityManager,
    po_item_id: number,
    selected_vendor: any[],
  ): Promise<void> {
    let processedItems = null;

    const baseFolder = path.join(
      __dirname,
      '../../../../../../../assets/uploads/',
    );
    const vendorIds = selected_vendor.map((v) => v.vendor_id);
    const uniqueVendorIds = new Set(vendorIds);

    if (vendorIds.length !== uniqueVendorIds.size) {
      throw new ManageDomainException(
        'errors.duplicate_vendor_id_in_selected_vendor',
        HttpStatus.BAD_REQUEST,
      );
    }

    for (const vendor of selected_vendor) {
      let fileKey = null;

      if (vendor.vendor_bank_account_id) {
        const check_vendor_bank_account = await manager.findOne(
          VendorBankAccountOrmEntity,
          {
            where: {
              id: vendor.vendor_bank_account_id,
              vendor_id: vendor.vendor_id,
            },
          },
        );
        assertOrThrow(
          check_vendor_bank_account,
          'errors.not_found',
          HttpStatus.NOT_FOUND,
        );
      }

      await findOneOrFail(manager, VendorOrmEntity, {
        id: vendor.vendor_id,
      });

      if (vendor.filename) {
        const mockFile = await createMockMulterFile(
          baseFolder,
          vendor.filename,
        );
        const optimizedImage =
          await this._optimizeService.optimizeImage(mockFile);
        const s3ImageResponse = await this._amazonS3ServiceKey.uploadFile(
          optimizedImage,
          PO_FILE_NAME_FOLDER,
        );
        fileKey = s3ImageResponse.fileKey;
      }

      processedItems = {
        ...vendor,
        filename: fileKey ?? '',
      };

      const vendorEntity = this._dataSVMapper.toEntity(
        processedItems,
        po_item_id,
      );

      await this._writeSV.create(vendorEntity, manager);
    }
  }

  private async savePOItem(
    query: CreateCommand,
    manager: EntityManager,
    po_id: number,
  ): Promise<void> {
    for (const item of query.dto.items) {
      const pr_item = await query.manager.findOne(
        PurchaseRequestItemOrmEntity,
        {
          where: {
            id: item.purchase_request_item_id,
          },
        },
      );

      assertOrThrow(pr_item, 'errors.not_found', HttpStatus.NOT_FOUND);

      const itemDto: CustomPurchaseOrderItemDto = {
        purchase_request_item_id: item.purchase_request_item_id,
        remark: pr_item?.remark ?? '',
        quantity: pr_item?.quantity ?? 0,
        price: item.price ?? 0,
        total: (pr_item?.quantity ?? 0) * (item.price ?? 0),
        is_vat: item?.is_vat ?? false,
      };
      const itemEntity = this._dataItemMapper.toEntity(itemDto, po_id);
      const po_item = await this._writeItem.create(itemEntity, manager);
      const po_item_id = (po_item as any)._id._value;

      await this.saveSelectedVendor(
        query,
        manager,
        po_item_id,
        item.selected_vendor,
      );
    }
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

  private async calculateTotal(
    query: CreateCommand,
    manager: EntityManager,
  ): Promise<number> {
    const purchaseRequestItems = query.dto.items;
    const purchaseRequestItemIds = purchaseRequestItems.map(
      (item) => item.purchase_request_item_id,
    );

    // Batch fetch all needed PR items
    const prItems = await manager.find(PurchaseRequestItemOrmEntity, {
      where: { id: In(purchaseRequestItemIds) },
    });

    // Build a Map for quick lookup by ID
    const prItemMap = new Map(prItems.map((prItem) => [prItem.id, prItem]));

    // Optionally: Check for missing items up front
    const missingIds = purchaseRequestItemIds.filter(
      (id) => !prItemMap.has(id),
    );
    if (missingIds.length > 0) {
      throw new ManageDomainException('errors.not_found', HttpStatus.NOT_FOUND);
    }

    // Calculate total
    const total = purchaseRequestItems.reduce((sum, item) => {
      const prItem = prItemMap.get(item.purchase_request_item_id)!;
      return sum + (prItem.quantity ?? 0) * item.price;
    }, 0);

    return total;
  }
}
