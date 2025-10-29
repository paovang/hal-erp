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
import { PRODUCT_APPLICATION_SERVICE } from '../application/constants/inject-key.const';
import { TRANSFORM_RESULT_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransformResultService } from '@src/common/application/interfaces/transform-result-service.interface';
import { IProductServiceInterface } from '../domain/ports/input/product-domain-service.interface';
import { ProductDataMapper } from '../application/mappers/product.mapper';
import { CreateProductDto } from '../application/dto/create/product/create.dto';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { ProductResponse } from '../application/dto/response/product.response';
import { ProductQueryDto } from '../application/dto/query/product-query.dto';
import { UpdateProductDto } from '../application/dto/create/product/update.dto';

@Controller('products')
export class ProductController {
  constructor(
    @Inject(PRODUCT_APPLICATION_SERVICE)
    private readonly _productService: IProductServiceInterface,
    @Inject(TRANSFORM_RESULT_SERVICE)
    private readonly _transformResultService: ITransformResultService,
    private readonly _dataMapper: ProductDataMapper,
  ) {}

  /** Create */
  @Post('')
  async create(
    @Body() dto: CreateProductDto,
  ): Promise<ResponseResult<ProductResponse>> {
    const result = await this._productService.create(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Get('')
  async getAll(
    @Query() dto: ProductQueryDto,
  ): Promise<ResponseResult<ProductResponse>> {
    const result = await this._productService.getAll(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Get(':id')
  async getOne(
    @Param('id') id: number,
  ): Promise<ResponseResult<ProductResponse>> {
    const result = await this._productService.getOne(id);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateProductDto,
  ): Promise<ResponseResult<ProductResponse>> {
    const result = await this._productService.update(id, dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this._productService.delete(id);
  }
}