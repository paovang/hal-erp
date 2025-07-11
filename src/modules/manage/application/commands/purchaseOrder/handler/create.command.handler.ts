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
import { DataSource, EntityManager } from 'typeorm';
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
  approval_workflow_step_id: number;
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

        if (!pr) {
          throw new ManageDomainException(
            'errors.not_found',
            HttpStatus.BAD_REQUEST,
          );
        }

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
          pr,
          po_number,
        );

        const po_result = await this._write.create(entity, manager);

        const po_id = (po_result as any)._id._value;

        // const pr_item = await manager.find(PurchaseRequestItemOrmEntity, {
        //   where: {
        //     purchase_request_id: pr.id,
        //   },
        // });

        // save po item
        await this.savePOItem(query, manager, po_id);

        // save selected vendor
        // await this.saveSelectedVendor(query, manager, po_id);

        // save user approval
        await this.saveUserApproval(query, manager, document_id);

        return po_result;
      },
    );
  }

  private async saveUserApproval(
    query: CreateCommand,
    manager: EntityManager,
    document_id: number,
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

    const user_approval_entity = this._dataUserApprovalMapper.toEntity(
      merge,
      aw_id,
    );

    const user_approval = await this._writeUserApproval.create(
      user_approval_entity,
      manager,
    );

    const ua_id = (user_approval as any)._id._value;

    const pendingDto: CustomApprovalDto = {
      user_approval_id: ua_id,
      approval_workflow_step_id: a_w_s!.id,
      statusId: STATUS_KEY.PENDING,
      remark: null,
    };
    const aw_step =
      this._dataUserApprovalMapperStep.toEntityForInsert(pendingDto);
    await this._writeUserApprovalStep.create(aw_step, manager);
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

      if (!pr_item) {
        throw new ManageDomainException(
          'errors.not_found',
          HttpStatus.BAD_REQUEST,
        );
      }

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
}
