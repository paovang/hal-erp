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
import { COMPANY_PRODUCT_APPLICATION_SERVICE } from '../application/constants/inject-key.const';
import { TRANSFORM_RESULT_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransformResultService } from '@src/common/application/interfaces/transform-result-service.interface';
import { ICompanyProductServiceInterface } from '../domain/ports/input/company-product-domain-service.interface';
import { CompanyProductDataMapper } from '../application/mappers/company-product.mapper';
import { CreateCompanyProductDto } from '../application/dto/create/company-product/create.dto';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { CompanyProductResponse } from '../application/dto/response/company-product.response';
import { CompanyProductQueryDto } from '../application/dto/query/company-product-query.dto';
import { UpdateCompanyProductDto } from '../application/dto/create/company-product/update.dto';

@Controller('company-products')
export class CompanyProductController {
  constructor(
    @Inject(COMPANY_PRODUCT_APPLICATION_SERVICE)
    private readonly _companyProductService: ICompanyProductServiceInterface,
    @Inject(TRANSFORM_RESULT_SERVICE)
    private readonly _transformResultService: ITransformResultService,
    private readonly _dataMapper: CompanyProductDataMapper,
  ) {}

  @Post('')
  async create(
    @Body() dto: CreateCompanyProductDto,
  ): Promise<ResponseResult<CompanyProductResponse>> {
    const result = await this._companyProductService.create(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Get('')
  async getAll(
    @Query() dto: CompanyProductQueryDto,
  ): Promise<ResponseResult<CompanyProductResponse>> {
    const result = await this._companyProductService.getAll(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Get(':id')
  async getOne(
    @Param('id') id: number,
  ): Promise<ResponseResult<CompanyProductResponse>> {
    const result = await this._companyProductService.getOne(id);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateCompanyProductDto,
  ): Promise<ResponseResult<CompanyProductResponse>> {
    const result = await this._companyProductService.update(id, dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this._companyProductService.delete(id);
  }
}
