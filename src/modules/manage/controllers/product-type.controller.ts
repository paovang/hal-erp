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
import { PRODUCT_TYPE_APPLICATION_SERVICE } from '../application/constants/inject-key.const';
import { TRANSFORM_RESULT_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransformResultService } from '@src/common/application/interfaces/transform-result-service.interface';
import { IProductTypeServiceInterface } from '../domain/ports/input/product-type-domain-service.interface';
import { ProductTypeDataMapper } from '../application/mappers/product-type.mapper';
import { CreateProductTypeDto } from '../application/dto/create/product-type/create.dto';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { ProductTypeResponse } from '../application/dto/response/product-type.response';
import { ProductTypeQueryDto } from '../application/dto/query/product-type-query.dto';
import { UpdateProductTypeDto } from '../application/dto/create/product-type/update.dto';

@Controller('product-types')
export class ProductTypeController {
  constructor(
    @Inject(PRODUCT_TYPE_APPLICATION_SERVICE)
    private readonly _productTypeService: IProductTypeServiceInterface,
    @Inject(TRANSFORM_RESULT_SERVICE)
    private readonly _transformResultService: ITransformResultService,
    private readonly _dataMapper: ProductTypeDataMapper,
  ) {}

  /** Create */
  @Post('')
  async create(
    @Body() dto: CreateProductTypeDto,
  ): Promise<ResponseResult<ProductTypeResponse>> {
    const result = await this._productTypeService.create(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Get('')
  async getAll(
    @Query() dto: ProductTypeQueryDto,
  ): Promise<ResponseResult<ProductTypeResponse>> {
    const result = await this._productTypeService.getAll(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Get(':id')
  async getOne(
    @Param('id') id: number,
  ): Promise<ResponseResult<ProductTypeResponse>> {
    const result = await this._productTypeService.getOne(id);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateProductTypeDto,
  ): Promise<ResponseResult<ProductTypeResponse>> {
    const result = await this._productTypeService.update(id, dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this._productTypeService.delete(id);
  }
}