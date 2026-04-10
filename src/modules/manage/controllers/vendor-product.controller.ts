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
import { VENDOR_PRODUCT_APPLICATION_SERVICE } from '../application/constants/inject-key.const';
import { TRANSFORM_RESULT_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransformResultService } from '@src/common/application/interfaces/transform-result-service.interface';
import { IVendorProductServiceInterface } from '../domain/ports/input/vendor-product-domain-service.interface';
import { VendorProductDataMapper } from '../application/mappers/vendor-product.mapper';
import { CreateVendorProductDto } from '../application/dto/create/vendor-product/create.dto';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { VendorProductResponse } from '../application/dto/response/vendor-product.response';
import { VendorProductQueryDto } from '../application/dto/query/vendor-product-query.dto';
import { UpdateVendorProductDto } from '../application/dto/create/vendor-product/update.dto';

@Controller('vendor-products')
export class VendorProductController {
  constructor(
    @Inject(VENDOR_PRODUCT_APPLICATION_SERVICE)
    private readonly _vendorProductService: IVendorProductServiceInterface,
    @Inject(TRANSFORM_RESULT_SERVICE)
    private readonly _transformResultService: ITransformResultService,
    private readonly _dataMapper: VendorProductDataMapper,
  ) {}

  /** Create */
  @Post('')
  async create(
    @Body() dto: CreateVendorProductDto,
  ): Promise<ResponseResult<VendorProductResponse>> {
    const result = await this._vendorProductService.create(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Get('')
  async getAll(
    @Query() dto: VendorProductQueryDto,
  ): Promise<ResponseResult<VendorProductResponse>> {
    const result = await this._vendorProductService.getAll(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Get(':id')
  async getOne(
    @Param('id') id: number,
  ): Promise<ResponseResult<VendorProductResponse>> {
    const result = await this._vendorProductService.getOne(id);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateVendorProductDto,
  ): Promise<ResponseResult<VendorProductResponse>> {
    const result = await this._vendorProductService.update(id, dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this._vendorProductService.delete(id);
  }
}
