import { Body, Controller, Inject, Post } from '@nestjs/common';
import { IPurchaseRequestServiceInterface } from '../domain/ports/input/purchase-request-service.interface';
import { TRANSFORM_RESULT_SERVICE } from '@src/common/constants/inject-key.const';
import { PURCHASE_REQUEST_APPLICATION_SERVICE } from '../application/constants/inject-key.const';
import { ITransformResultService } from '@src/common/application/interfaces/transform-result-service.interface';
import { PurchaseRequestDataMapper } from '../application/mappers/purchase-request.mapper';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { PurchaseRequestResponse } from '../application/dto/response/purchase-request.response';
import { CreatePurchaseRequestDto } from '../application/dto/create/purchaseRequest/create.dto';

@Controller('purchase-requests')
export class PurchaseRequestController {
  constructor(
    @Inject(PURCHASE_REQUEST_APPLICATION_SERVICE)
    private readonly _purchaseRequestService: IPurchaseRequestServiceInterface,
    @Inject(TRANSFORM_RESULT_SERVICE)
    private readonly _transformResultService: ITransformResultService,
    private readonly _dataMapper: PurchaseRequestDataMapper,
  ) {}

  @Post('')
  async create(
    @Body() dto: CreatePurchaseRequestDto,
  ): Promise<ResponseResult<PurchaseRequestResponse>> {
    const result = await this._purchaseRequestService.create(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }
}
