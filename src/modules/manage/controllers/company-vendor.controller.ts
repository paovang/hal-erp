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
import { COMPANY_VENDOR_APPLICATION_SERVICE } from '../application/constants/inject-key.const';
import { TRANSFORM_RESULT_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransformResultService } from '@src/common/application/interfaces/transform-result-service.interface';
import { ICompanyVendorServiceInterface } from '../domain/ports/input/company-vendor-domain-service.interface';
import { CompanyVendorDataMapper } from '../application/mappers/company-vendor.mapper';
import { CreateCompanyVendorDto } from '../application/dto/create/company-vendor/create.dto';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { CompanyVendorResponse } from '../application/dto/response/company-vendor.response';
import { CompanyVendorQueryDto } from '../application/dto/query/company-vendor-query.dto';
import { UpdateCompanyVendorDto } from '../application/dto/create/company-vendor/update.dto';

@Controller('company-vendors')
export class CompanyVendorController {
  constructor(
    @Inject(COMPANY_VENDOR_APPLICATION_SERVICE)
    private readonly _companyVendorService: ICompanyVendorServiceInterface,
    @Inject(TRANSFORM_RESULT_SERVICE)
    private readonly _transformResultService: ITransformResultService,
    private readonly _dataMapper: CompanyVendorDataMapper,
  ) {}

  @Post('')
  async create(
    @Body() dto: CreateCompanyVendorDto,
  ): Promise<ResponseResult<CompanyVendorResponse>> {
    const result = await this._companyVendorService.create(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Get('')
  async getAll(
    @Query() dto: CompanyVendorQueryDto,
  ): Promise<ResponseResult<CompanyVendorResponse>> {
    const result = await this._companyVendorService.getAll(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Get(':id')
  async getOne(
    @Param('id') id: number,
  ): Promise<ResponseResult<CompanyVendorResponse>> {
    const result = await this._companyVendorService.getOne(id);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateCompanyVendorDto,
  ): Promise<ResponseResult<CompanyVendorResponse>> {
    const result = await this._companyVendorService.update(id, dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this._companyVendorService.delete(id);
  }
}
