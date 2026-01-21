import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { CreateCommand } from '../create.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { PurchaseRequestEntity } from '@src/modules/manage/domain/entities/purchase-request.entity';
import { Inject, HttpStatus } from '@nestjs/common';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import {
  LENGTH_DOCUMENT_CODE,
  LENGTH_PURCHASE_REQUEST_CODE,
  PR_FILE_NAME_FOLDER,
  READ_PURCHASE_REQUEST_REPOSITORY,
  WRITE_DOCUMENT_APPROVER_REPOSITORY,
  WRITE_DOCUMENT_REPOSITORY,
  WRITE_PURCHASE_REQUEST_ITEM_REPOSITORY,
  WRITE_PURCHASE_REQUEST_REPOSITORY,
  WRITE_USER_APPROVAL_REPOSITORY,
  WRITE_USER_APPROVAL_STEP_REPOSITORY,
} from '../../../constants/inject-key.const';
import {
  IReadPurchaseRequestRepository,
  IWritePurchaseRequestRepository,
} from '@src/modules/manage/domain/ports/output/purchase-request-repository.interface';
import { PurchaseRequestDataMapper } from '../../../mappers/purchase-request.mapper';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { PurchaseRequestOrmEntity } from '@src/common/infrastructure/database/typeorm/purchase-request.orm';
import { CodeGeneratorUtil } from '@src/common/utils/code-generator.util';
import {
  TRANSACTION_MANAGER_SERVICE,
  USER_PROFILE_IMAGE_FILE_OPTIMIZE_SERVICE_KEY,
} from '@src/common/constants/inject-key.const';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager, In } from 'typeorm';
import { UserContextService } from '@src/common/infrastructure/cls/cls.service';
import path from 'path';
import { createMockMulterFile } from '@src/common/utils/services/file-utils.service';
import { IImageOptimizeService } from '@src/common/utils/services/images/interface/image-optimize-service.interface';
import { AMAZON_S3_SERVICE_KEY } from '@src/common/infrastructure/aws3/config/inject-key';
import { IAmazonS3ImageService } from '@src/common/infrastructure/aws3/interface/amazon-s3-image-service.interface';
import { PurchaseRequestItemDataMapper } from '../../../mappers/purchase-request-item.mapper';
import { IWritePurchaseRequestItemRepository } from '@src/modules/manage/domain/ports/output/purchase-request-item-repository.interface';
import { IWriteDocumentRepository } from '@src/modules/manage/domain/ports/output/document-repository.interface';
import { DocumentDataMapper } from '../../../mappers/document.mapper';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DocumentOrmEntity } from '@src/common/infrastructure/database/typeorm/document.orm';
import { DocumentEntityMode } from '@src/common/utils/orm-entity-method.enum';
import { DepartmentUserOrmEntity } from '@src/common/infrastructure/database/typeorm/department-user.orm';
import { UserApprovalDataMapper } from '../../../mappers/user-approval.mapper';
import { IWriteUserApprovalRepository } from '@src/modules/manage/domain/ports/output/user-approval-repository.interface';
import { IWriteUserApprovalStepRepository } from '@src/modules/manage/domain/ports/output/user-approval-step-repository.interface';
import { UserApprovalStepDataMapper } from '../../../mappers/user-approval-step.mapper';
// import { BudgetApprovalRuleOrmEntity } from '@src/common/infrastructure/database/typeorm/budget-approval-rule.orm';
import { IWriteDocumentApproverRepository } from '@src/modules/manage/domain/ports/output/document-approver-repository.interface';
import { DocumentApproverDataMapper } from '../../../mappers/document-approver.mapper';
import { ApprovalDto } from '../../../dto/create/userApprovalStep/update-statue.dto';
import { CreateUserApprovalDto } from '../../../dto/create/userApproval/create.dto';
import { DepartmentOrmEntity } from '@src/common/infrastructure/database/typeorm/department.orm';
import { sendApprovalRequest } from '@src/common/utils/server/send-data.uitl';
import {
  EnumRequestApprovalType,
  STATUS_KEY,
} from '../../../constants/status-key.const';
import { PurchaseRequestId } from '@src/modules/manage/domain/value-objects/purchase-request-id.vo';
import { DocumentTypeOrmEntity } from '@src/common/infrastructure/database/typeorm/document-type.orm';
import { ApprovalWorkflowOrmEntity } from '@src/common/infrastructure/database/typeorm/approval-workflow.orm';
import { StatusEnum } from '@src/common/enums/status.enum';
import { QuotaCompanyOrmEntity } from '@src/common/infrastructure/database/typeorm/quota-company.orm';
import { CompanyUserOrmEntity } from '@src/common/infrastructure/database/typeorm/company-user.orm';
import { PurchaseRequestItemOrmEntity } from '@src/common/infrastructure/database/typeorm/purchase-request-item.orm';
import { UnitOrmEntity } from '@src/common/infrastructure/database/typeorm/unit.orm';
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

interface CustomDocumentApprover {
  user_approval_step_id: number;
  user_id: number;
}

@CommandHandler(CreateCommand)
export class CreateCommandHandler
  implements IQueryHandler<CreateCommand, ResponseResult<PurchaseRequestEntity>>
{
  constructor(
    @Inject(WRITE_PURCHASE_REQUEST_REPOSITORY)
    private readonly _write: IWritePurchaseRequestRepository,
    private readonly _dataMapper: PurchaseRequestDataMapper,
    private readonly _codeGeneratorUtil: CodeGeneratorUtil,
    @Inject(READ_PURCHASE_REQUEST_REPOSITORY)
    private readonly _read: IReadPurchaseRequestRepository,
    // item
    @Inject(WRITE_PURCHASE_REQUEST_ITEM_REPOSITORY)
    private readonly _writeItem: IWritePurchaseRequestItemRepository,
    private readonly _dataItemMapper: PurchaseRequestItemDataMapper,
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
    @Inject(USER_PROFILE_IMAGE_FILE_OPTIMIZE_SERVICE_KEY)
    private readonly _optimizeService: IImageOptimizeService,
    @Inject(AMAZON_S3_SERVICE_KEY)
    private readonly _amazonS3ServiceKey: IAmazonS3ImageService,
  ) {}

  async execute(
    query: CreateCommand,
  ): Promise<ResponseResult<PurchaseRequestEntity>> {
    const expiredDateFormatted = moment(query.dto.expired_date).format(
      'YYYY-MM-DD',
    );

    if (expiredDateFormatted.includes('Invalid date')) {
      throw new ManageDomainException(
        'errors.expired_date_invalid',
        HttpStatus.BAD_REQUEST,
      );
    }

    const expiredDate = moment.tz(query.dto.expired_date, Timezone.LAOS);

    const today = moment.tz(Timezone.LAOS).startOf('day');

    if (expiredDate.isBefore(today)) {
      throw new ManageDomainException(
        'errors.expired_date_must_not_be_in_past',
        HttpStatus.BAD_REQUEST,
      );
    }

    const document_number = await this._codeGeneratorUtil.generateUniqueCode(
      LENGTH_DOCUMENT_CODE,
      async (generatedCode: string) => {
        try {
          await findOneOrFail(query.manager, DocumentOrmEntity, {
            document_number: generatedCode,
          });
          return false;
        } catch {
          return true;
        }
      },
      'D',
    );

    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        const check_document_type = await findOneOrFail(
          manager,
          DocumentTypeOrmEntity,
          {
            id: query.dto.document.documentTypeId,
          },
          `Document Type ID: ${query.dto.document.documentTypeId}`,
        );

        const document_type_id = (check_document_type as any).id;
        const check_workflow_status = await manager.findOne(
          ApprovalWorkflowOrmEntity,
          {
            where: { document_type_id: document_type_id },
          },
        );

        if (
          check_workflow_status &&
          check_workflow_status.status === StatusEnum.PENDING
        ) {
          throw new ManageDomainException(
            'errors.not_approve_workflow_yet',
            HttpStatus.BAD_REQUEST,
            { property: 'Approval Workflow' },
          );
        } else if (!check_workflow_status) {
          throw new ManageDomainException(
            'errors.not_found',
            HttpStatus.BAD_REQUEST,
            { property: 'Approval Workflow' },
          );
        }

        const baseFolder = path.join(
          __dirname,
          '../../../../../../../assets/uploads/',
        );

        const user = this._userContextService.getAuthUser()?.user;
        const user_id = user.id;
        let company_id: number | null | undefined = null;
        const company = await manager.findOne(CompanyUserOrmEntity, {
          where: {
            user_id: user_id,
          },
        });

        company_id = company?.company_id ?? null;

        const department = await findOneOrFail(
          manager,
          DepartmentUserOrmEntity,
          {
            user_id: user_id,
          },
          `department user id: ${user_id}`,
        );

        const department_id = (department as any).department_id;

        const get_department_name = await findOneOrFail(
          manager,
          DepartmentOrmEntity,
          {
            id: department_id,
          },
          `department id: ${department_id}`,
        );

        const department_name = (get_department_name as any).name;
        const department_code = (get_department_name as any).code;
        const code = await this._codeGeneratorUtil.generateSequentialUniqueCode(
          LENGTH_PURCHASE_REQUEST_CODE,
          async (generatedCode: string) => {
            try {
              await findOneOrFail(manager, PurchaseRequestOrmEntity, {
                pr_number: generatedCode,
              });
              return false;
            } catch {
              return true;
            }
          },
          department_code,
        );

        const DEntity = this._dataDMapper.toEntity(
          query.dto.document,
          DocumentEntityMode.CREATE,
          document_number,
          user_id,
          department_id,
          company_id || undefined,
        );

        const D = await this._writeD.create(DEntity, manager);

        const document_id = (D as any)._id._value;

        const entity = this._dataMapper.toEntity(query.dto, code, document_id);

        const pr = await this._write.create(entity, manager);

        const pr_id = (pr as any)._id._value;

        await this.insertItem(query, manager, baseFolder, pr_id);

        const purchaseRequestItems = query.dto.purchase_request_items;

        const total = purchaseRequestItems.reduce((total, item) => {
          return total + item.quantity * item.price;
        }, 0);

        const merge: CustomUserApprovalDto = {
          documentId: document_id,
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
          step_number: 0,
          statusId: STATUS_KEY.PENDING,
          remark: null,
          requires_file_upload: false, // assert that it is not null or undefined
          is_otp: true,
        };
        const aw_step =
          this._dataUserApprovalMapperStep.toEntityForInsert(pendingDto);
        const user_approval_step = await this._writeUserApprovalStep.create(
          aw_step,
          manager,
        );

        const user_approval_step_id = (user_approval_step as any)._id._value;
        const titles = purchaseRequestItems
          .map((item) => item.title)
          .join(', ');

        // send approval request server to server
        await sendApprovalRequest(
          user_approval_step_id,
          total,
          user,
          user_id,
          department_name,
          EnumRequestApprovalType.PR,
          titles,
        );

        const d_approver: CustomDocumentApprover = {
          user_approval_step_id,
          user_id: user_id ?? 0,
        };

        const d_approver_entity =
          await this._dataDocumentApproverMapper.toEntity(d_approver);

        await this._writeDocumentApprover.create(d_approver_entity, manager);

        return await this._read.findOne(new PurchaseRequestId(pr_id), manager);
      },
    );
  }

  // --- Private Helper Method for Summing Existing Items (Unchanged) ---
  private async getExistingRequestItemQuantity(
    manager: EntityManager,
    quotaId: number,
  ): Promise<number> {
    const result = await manager
      .createQueryBuilder(PurchaseRequestItemOrmEntity, 'item')
      .select('SUM(item.quantity)', 'totalQuantity')
      .where('item.quota_company_id IS NOT NULL')
      .andWhere('item.quota_company_id = :quotaId', { quotaId })
      .getRawOne<{ totalQuantity: string | null }>();

    const totalQuantity = parseInt(result?.totalQuantity || '0') || 0;
    return totalQuantity;
  }

  // ---------------------------------------------------------------------

  private async insertItem(
    query: CreateCommand,
    manager: EntityManager,
    baseFolder: string,
    pr_id: number,
  ): Promise<void> {
    const quotaCompanyIds: number[] = [];
    const requestedQuantitiesByQuota = new Map<number, number>();

    // --- 1. PREPARATION: GROUP QUANTITIES (IN-MEMORY) ---
    for (const item of query.dto.purchase_request_items) {
      const quotaId = item.quota_company_id;
      if (!quotaCompanyIds.includes(quotaId)) {
        quotaCompanyIds.push(quotaId);
      }
      requestedQuantitiesByQuota.set(
        quotaId,
        (requestedQuantitiesByQuota.get(quotaId) || 0) + item.quantity,
      );
    }

    // --- 2. VALIDATION PHASE: BULK CHECKS (Must happen BEFORE Item Creation) ---

    // 2a. Bulk Load all Quota Entities (1 DB Query)
    const existingQuotas = await manager.find(QuotaCompanyOrmEntity, {
      where: { id: In(quotaCompanyIds) },
      relations: ['vendor_product', 'vendor_product.products'],
    });
    const quotaMap = new Map(existingQuotas.map((q) => [q.id, q]));

    // 2b. Iterate and Validate Quota Limits
    for (const [
      quotaId,
      requestedQty,
    ] of requestedQuantitiesByQuota.entries()) {
      const get_quota = quotaMap.get(quotaId);

      if (!get_quota) {
        throw new ManageDomainException(
          'errors.not_found',
          HttpStatus.NOT_FOUND,
          { property: `quota company id: ${quotaId}` },
        );
      }

      // Calculate existing usage (1 DB Query per unique Quota ID)
      const existingTotal = await this.getExistingRequestItemQuantity(
        manager,
        quotaId,
      );
      const maxLimit = get_quota.qty ?? 0;
      const availableQuota = maxLimit - existingTotal;

      // Check 3: Final Validation
      if (requestedQty > availableQuota) {
        throw new ManageDomainException(
          'errors.quota_limit_exceeded',
          HttpStatus.BAD_REQUEST,
          {
            property: `${get_quota.vendor_product?.products?.name || 'Item'} : ${availableQuota}`,
          },
        );
      }
    }

    // --- 3. FINAL PROCESSING AND ITEM-BY-ITEM WRITE ---
    for (const item of query.dto.purchase_request_items) {
      await findOneOrFail(
        query.manager,
        UnitOrmEntity,
        {
          id: item.unit_id,
        },
        `unit id: ${item.unit_id}`,
      );

      await findOneOrFail(
        query.manager,
        QuotaCompanyOrmEntity,
        {
          id: item.quota_company_id,
        },
        `quota company id: ${item.quota_company_id}`,
      );
      // File Upload (Still necessary)
      let fileKey = null;
      if (item.file_name) {
        const mockFile = await createMockMulterFile(baseFolder, item.file_name);
        const optimizedImage =
          await this._optimizeService.optimizeImage(mockFile);
        const s3ImageResponse = await this._amazonS3ServiceKey.uploadFile(
          optimizedImage,
          PR_FILE_NAME_FOLDER,
        );
        fileKey = s3ImageResponse.fileKey;
      }

      const sum_total = item.quantity * item.price;
      const processedItemData = { ...item, file_name: fileKey };

      // Ensure the mapper creates a valid TypeORM Entity instance
      const pr_item = this._dataItemMapper.toEntity(
        processedItemData,
        pr_id,
        sum_total,
      );

      // ITEM-BY-ITEM WRITE (As requested, one database call per item)
      await this._writeItem.create(pr_item, manager);
    }
  }
}
