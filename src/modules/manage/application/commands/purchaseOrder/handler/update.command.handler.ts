import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { UpdateCommand } from '../update.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { PurchaseOrderEntity } from '@src/modules/manage/domain/entities/purchase-order.entity';
import { HttpStatus, Inject } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import {
  TRANSACTION_MANAGER_SERVICE,
  USER_PROFILE_IMAGE_FILE_OPTIMIZE_SERVICE_KEY,
} from '@src/common/constants/inject-key.const';
import { AMAZON_S3_SERVICE_KEY } from '@src/common/infrastructure/aws3/config/inject-key';
import { DataSource } from 'typeorm';
import { UserContextService } from '@src/common/infrastructure/cls/cls.service';
import { IImageOptimizeService } from '@src/common/utils/services/images/interface/image-optimize-service.interface';
import { IAmazonS3ImageService } from '@src/common/infrastructure/aws3/interface/amazon-s3-image-service.interface';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import {
  PO_FILE_NAME_FOLDER,
  WRITE_PURCHASE_ORDER_ITEM_REPOSITORY,
  WRITE_PURCHASE_ORDER_REPOSITORY,
  WRITE_PURCHASE_ORDER_SELECTED_VENDOR_REPOSITORY,
} from '../../../constants/inject-key.const';
import { IWritePurchaseOrderSelectedVendorRepository } from '@src/modules/manage/domain/ports/output/Purchase-order-selected-vendor-repository.interface';
import { PurchaseOrderSelectedVendorDataMapper } from '../../../mappers/purchase-order-selected-vendor.mapper';
import path from 'path';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { VendorOrmEntity } from '@src/common/infrastructure/database/typeorm/vendor.orm';
import { createMockMulterFile } from '@src/common/utils/services/file-utils.service';
import { PurchaseOrderSelectedVendorId } from '@src/modules/manage/domain/value-objects/purchase-order-selected-vendor-id.vo';
import { PurchaseOrderSelectedVendorOrmEntity } from '@src/common/infrastructure/database/typeorm/purchase-order-selected-vendor.orm';
import { PurchaseOrderOrmEntity } from '@src/common/infrastructure/database/typeorm/purchase-order.orm';
import { PurchaseOrderDataMapper } from '../../../mappers/purchase-order.mapper';
import { IWritePurchaseOrderRepository } from '@src/modules/manage/domain/ports/output/purchase-order-repository.interface';
import { PurchaseOrderId } from '@src/modules/manage/domain/value-objects/purchase-order-id.vo';
import { IWritePurchaseOrderItemRepository } from '@src/modules/manage/domain/ports/output/purchase-order-item-repository.interface';
import { PurchaseOrderItemDataMapper } from '../../../mappers/purchase-order-item.mapper';
import { PurchaseOrderItemId } from '@src/modules/manage/domain/value-objects/purchase-order-item-id.vo';
import { PurchaseOrderItemOrmEntity } from '@src/common/infrastructure/database/typeorm/purchase-order-item.orm';

interface CustomPurchaseOrderItemDto {
  purchase_request_item_id: number;
  remark: string;
  price: number;
  quantity: number;
  total: number;
  is_vat: boolean;
}

@CommandHandler(UpdateCommand)
export class UpdateCommandHandler
  implements IQueryHandler<UpdateCommand, ResponseResult<PurchaseOrderEntity>>
{
  constructor(
    @Inject(WRITE_PURCHASE_ORDER_REPOSITORY)
    private readonly _write: IWritePurchaseOrderRepository,
    private readonly _dataMapper: PurchaseOrderDataMapper,
    @Inject(WRITE_PURCHASE_ORDER_ITEM_REPOSITORY)
    private readonly _writeItem: IWritePurchaseOrderItemRepository,
    private readonly _dataItemMapper: PurchaseOrderItemDataMapper,
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
  ) {}

  async execute(
    query: UpdateCommand,
  ): Promise<ResponseResult<PurchaseOrderEntity>> {
    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        const processedItems = null;

        await findOneOrFail(manager, PurchaseOrderOrmEntity, {
          id: query.id,
        });

        const baseFolder = path.join(
          __dirname,
          '../../../../../../../assets/uploads/',
        );

        // for (const item of query.dto.items) {
        //   const pr_item = await query.manager.findOne(
        //     PurchaseOrderItemOrmEntity,
        //     {
        //       where: {
        //         id: item.id,
        //       },
        //     },
        //   );

        //   if (!pr_item) {
        //     throw new ManageDomainException(
        //       'errors.not_found',
        //       HttpStatus.BAD_REQUEST,
        //     );
        //   }

        //   const customItem: CustomPurchaseOrderItemDto = {
        //     purchase_request_item_id: pr_item?.purchase_request_item_id ?? 0,
        //     remark: pr_item.remark ?? '', // or some default value
        //     quantity: pr_item.quantity ?? 0, // or some default value
        //     price: item.price, // assuming this property exists
        //     total: (pr_item?.quantity ?? 0) * (item.price ?? 0),
        //     is_vat: item?.is_vat ?? false,
        //   };
        //   const itemEntity = this._dataItemMapper.toEntity(
        //     customItem,
        //     query.id,
        //   );

        //   await itemEntity.initializeUpdateSetId(
        //     new PurchaseOrderItemId(item.id),
        //   );
        //   await itemEntity.validateExistingIdForUpdate();

        //   await this._writeItem.update(itemEntity, manager);

        //   for (const vendor of item.selected_vendor) {
        //     let fileKey = null;
        //     await findOneOrFail(manager, VendorOrmEntity, {
        //       id: vendor.vendor_id,
        //     });

        //     if (vendor.id) {
        //       await findOneOrFail(
        //         manager,
        //         PurchaseOrderSelectedVendorOrmEntity,
        //         {
        //           id: vendor.id,
        //         },
        //       );
        //     }

        //     if (vendor.filename) {
        //       const mockFile = await createMockMulterFile(
        //         baseFolder,
        //         vendor.filename,
        //       );
        //       const optimizedImage =
        //         await this._optimizeService.optimizeImage(mockFile);
        //       const s3ImageResponse = await this._amazonS3ServiceKey.uploadFile(
        //         optimizedImage,
        //         PO_FILE_NAME_FOLDER,
        //       );
        //       fileKey = s3ImageResponse.fileKey;
        //     }

        //     processedItems = {
        //       ...vendor,
        //       filename: fileKey ?? '',
        //     };

        //     const vendorEntity = this._dataSVMapper.toEntity(
        //       processedItems,
        //       item.id,
        //     );

        //     await vendorEntity.initializeUpdateSetId(
        //       new PurchaseOrderSelectedVendorId(vendor.id),
        //     );
        //     await vendorEntity.validateExistingIdForUpdate();

        //     await this._writeSV.update(vendorEntity, manager);
        //   }
        // }

        await this.updateItem(query, manager, baseFolder, processedItems);

        const purchaseOrderEntity = this._dataMapper.toEntity(query.dto);
        await purchaseOrderEntity.initializeUpdateSetId(
          new PurchaseOrderId(query.id),
        );
        await purchaseOrderEntity.validateExistingIdForUpdate();
        return purchaseOrderEntity;
      },
    );
  }

  //   private async updateIQ(
  //     query: UpdateCommand,
  //     manager: DataSource['manager'],
  //   ): Promise<void> {
  //     const selectedVendor = query.dto.selected_vendor.find(
  //       (v) => v.status === true,
  //     );

  //     for (const item of po_item) {
  //       const IQ = await manager.findOne(PurchaseOrderItemQuoteOrmEntity, {
  //         where: {
  //           purchase_order_item_id: item.id,
  //         },
  //       });

  //       if (!IQ) {
  //         throw new ManageDomainException(
  //           'errors.not_found',
  //           HttpStatus.BAD_REQUEST,
  //         );
  //       }

  //       const quoteDto: CustomPurchaseOrderItemQuoteDto = {
  //         purchase_order_item_id: item.id,
  //         vendor_id: selectedVendor?.vendor_id ?? 0,
  //         price: IQ.price ?? 0,
  //         total: IQ.total ?? 0,
  //         is_selected: selectedVendor?.status ?? false,
  //       };

  //       const IQEntity = this._dataIQMapper.toEntity(quoteDto);

  //       await IQEntity.initializeUpdateSetId(new PurchaseOrderItemQuoteId(IQ.id));
  //       await IQEntity.validateExistingIdForUpdate();

  //       await this._writeIQ.update(IQEntity, manager);
  //     }
  //   }

  private async updateItem(
    query: UpdateCommand,
    manager: DataSource['manager'],
    baseFolder: string,
    processedItems: any,
  ): Promise<void> {
    for (const item of query.dto.items) {
      const pr_item = await query.manager.findOne(PurchaseOrderItemOrmEntity, {
        where: {
          id: item.id,
        },
      });

      if (!pr_item) {
        throw new ManageDomainException(
          'errors.not_found',
          HttpStatus.BAD_REQUEST,
        );
      }

      const customItem: CustomPurchaseOrderItemDto = {
        purchase_request_item_id: pr_item?.purchase_request_item_id ?? 0,
        remark: pr_item.remark ?? '', // or some default value
        quantity: pr_item.quantity ?? 0, // or some default value
        price: item.price, // assuming this property exists
        total: (pr_item?.quantity ?? 0) * (item.price ?? 0),
        is_vat: item?.is_vat ?? false,
      };
      const itemEntity = this._dataItemMapper.toEntity(customItem, query.id);

      await itemEntity.initializeUpdateSetId(new PurchaseOrderItemId(item.id));
      await itemEntity.validateExistingIdForUpdate();

      await this._writeItem.update(itemEntity, manager);

      for (const vendor of item.selected_vendor) {
        let fileKey = null;
        await findOneOrFail(manager, VendorOrmEntity, {
          id: vendor.vendor_id,
        });

        if (vendor.id) {
          await findOneOrFail(manager, PurchaseOrderSelectedVendorOrmEntity, {
            id: vendor.id,
          });
        }

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
          item.id,
        );

        await vendorEntity.initializeUpdateSetId(
          new PurchaseOrderSelectedVendorId(vendor.id),
        );
        await vendorEntity.validateExistingIdForUpdate();

        await this._writeSV.update(vendorEntity, manager);
      }
    }
  }
}
