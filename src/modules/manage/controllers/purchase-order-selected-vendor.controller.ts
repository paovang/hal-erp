import {
  Controller,
  HttpStatus,
  Inject,
  Param,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerStorage } from '@src/common/utils/multer.utils';
import { FileValidationInterceptor } from '@src/common/interceptors/file/file.interceptor';
import { FileMimeTypeValidator } from '@src/common/validations/file-mime-type.validator';
import { FileSizeValidator } from '@src/common/validations/file-size.validator';
import {
  SUPPORTED_UPLOAD_MIME_TYPES,
  TRANSFORM_RESULT_SERVICE,
} from '@src/common/constants/inject-key.const';
import { ITransformResultService } from '@src/common/application/interfaces/transform-result-service.interface';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { PURCHASE_ORDER_SELECTED_VENDOR_APPLICATION_SERVICE } from '../application/constants/inject-key.const';
import { IPurchaseOrderSelectedVendorServiceInterface } from '../domain/ports/input/purchase-order-selected-vendor-domain-service.interface';
import { PurchaseOrderSelectedVendorDataMapper } from '../application/mappers/purchase-order-selected-vendor.mapper';
import { PurchaseOrderSelectedVendorResponse } from '../application/dto/response/purchase-order-selected-vendor.response';
import { UpdatePurchaseOrderSelectedVendorFileDto } from '../application/dto/create/purchaseOrderSelectedVendor/update-file.dto';
import { ManageDomainException } from '../domain/exceptions/manage-domain.exception';

@Controller('purchase-order-selected-vendors')
export class PurchaseOrderSelectedVendorController {
  constructor(
    @Inject(PURCHASE_ORDER_SELECTED_VENDOR_APPLICATION_SERVICE)
    private readonly _service: IPurchaseOrderSelectedVendorServiceInterface,
    @Inject(TRANSFORM_RESULT_SERVICE)
    private readonly _transformResultService: ITransformResultService,
    private readonly _dataMapper: PurchaseOrderSelectedVendorDataMapper,
  ) {}

  @Patch(':id/file')
  @ApiOperation({
    summary: 'Replace the uploaded file of a purchase order selected vendor',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', { storage: multerStorage }),
    new FileValidationInterceptor(
      new FileMimeTypeValidator([...SUPPORTED_UPLOAD_MIME_TYPES]),
      new FileSizeValidator(10 * 1024 * 1024),
      'file',
    ),
  )
  async updateFile(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseResult<PurchaseOrderSelectedVendorResponse>> {
    if (!file) {
      throw new ManageDomainException(
        'errors.file_name_required',
        HttpStatus.BAD_REQUEST,
      );
    }

    const dto: UpdatePurchaseOrderSelectedVendorFileDto = {
      filename: file.filename,
    };
    const result = await this._service.updateFile(id, dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }
}
