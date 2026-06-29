import { Body, Controller, Inject, Param, Patch } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { TRANSFORM_RESULT_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransformResultService } from '@src/common/application/interfaces/transform-result-service.interface';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { PURCHASE_ORDER_SELECTED_VENDOR_APPLICATION_SERVICE } from '../application/constants/inject-key.const';
import { IPurchaseOrderSelectedVendorServiceInterface } from '../domain/ports/input/purchase-order-selected-vendor-domain-service.interface';
import { PurchaseOrderSelectedVendorDataMapper } from '../application/mappers/purchase-order-selected-vendor.mapper';
import { PurchaseOrderSelectedVendorResponse } from '../application/dto/response/purchase-order-selected-vendor.response';
import { UpdatePurchaseOrderSelectedVendorFileDto } from '../application/dto/create/purchaseOrderSelectedVendor/update-file.dto';

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
  async updateFile(
    @Param('id') id: number,
    @Body() dto: UpdatePurchaseOrderSelectedVendorFileDto,
  ): Promise<ResponseResult<PurchaseOrderSelectedVendorResponse>> {
    const result = await this._service.updateFile(id, dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }
}
