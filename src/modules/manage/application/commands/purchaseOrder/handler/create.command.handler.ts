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
import { DataSource } from 'typeorm';
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

interface CustomPurchaseOrderItemDto {
  purchase_request_item_id: number;
  remark: string;
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
        let processedItems = null;

        const baseFolder = path.join(
          __dirname,
          '../../../../../../../assets/uploads/',
        );

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

        const pr_item = await manager.find(PurchaseRequestItemOrmEntity, {
          where: {
            purchase_request_id: pr.id,
          },
        });

        for (const item of pr_item) {
          const itemDto: CustomPurchaseOrderItemDto = {
            purchase_request_item_id: item.id,
            remark: item.remark ?? '',
          };
          const itemEntity = this._dataItemMapper.toEntity(itemDto, po_id);
          await this._writeItem.create(itemEntity, manager);
        }

        const vendorIds = query.dto.selected_vendor.map((v) => v.vendor_id);
        const uniqueVendorIds = new Set(vendorIds);

        if (vendorIds.length !== uniqueVendorIds.size) {
          throw new ManageDomainException(
            'errors.duplicate_vendor_id_in_selected_vendor',
            HttpStatus.BAD_REQUEST,
          );
        }

        for (const vendor of query.dto.selected_vendor) {
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
            po_id,
          );

          await this._writeSV.create(vendorEntity, manager);
        }

        return po_result;
      },
    );
  }
}
