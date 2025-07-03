import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { IPurchaseRequestServiceInterface } from '../domain/ports/input/purchase-request-service.interface';
import { TRANSFORM_RESULT_SERVICE } from '@src/common/constants/inject-key.const';
import { PURCHASE_REQUEST_APPLICATION_SERVICE } from '../application/constants/inject-key.const';
import { ITransformResultService } from '@src/common/application/interfaces/transform-result-service.interface';
import { PurchaseRequestDataMapper } from '../application/mappers/purchase-request.mapper';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { PurchaseRequestResponse } from '../application/dto/response/purchase-request.response';
import { CreatePurchaseRequestDto } from '../application/dto/create/purchaseRequest/create.dto';
import { PurchaseRequestQueryDto } from '../application/dto/query/purchase-request.dto';
import { UpdatePurchaseRequestDto } from '../application/dto/create/purchaseRequest/update.dto';

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

  @Get('')
  async getAll(
    @Query() dto: PurchaseRequestQueryDto,
  ): Promise<ResponseResult<PurchaseRequestResponse>> {
    const result = await this._purchaseRequestService.getAll(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Get(':id')
  async getOne(
    @Param('id') id: number,
  ): Promise<ResponseResult<PurchaseRequestResponse>> {
    const result = await this._purchaseRequestService.getOne(id);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdatePurchaseRequestDto,
  ): Promise<ResponseResult<PurchaseRequestResponse>> {
    const result = await this._purchaseRequestService.update(id, dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this._purchaseRequestService.delete(id);
  }
}
