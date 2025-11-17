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
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { QuotaCompanyQueryDto } from '../application/dto/query/quota-company.dto';
import { QUOTA_COMPANY_APPLICATION_SERVICE } from '../application/constants/inject-key.const';
import { IQuotaCompanyServiceInterface } from '../domain/ports/input/quota-company-domain-service.interface';
import { ITransformResultService } from '@src/common/application/interfaces/transform-result-service.interface';
import { TRANSFORM_RESULT_SERVICE } from '@src/common/constants/inject-key.const';
import { QuotaCompanyDataMapper } from '../application/mappers/quota-company.mapper';
import { QuotaCompanyResponse } from '../application/dto/response/quota-company.response';
import { CreateQuotaCompanyDto } from '../application/dto/create/QuotaCompany/create.dto';
import { UpdateQuotaCompanyDto } from '../application/dto/create/QuotaCompany/update.dto';

@Controller('quota-company')
export class QuotaCompanyController {
  constructor(
    @Inject(QUOTA_COMPANY_APPLICATION_SERVICE)
    private readonly _quotaCompanyService: IQuotaCompanyServiceInterface,
    @Inject(TRANSFORM_RESULT_SERVICE)
    private readonly _transformResultService: ITransformResultService,
    private readonly _dataMapper: QuotaCompanyDataMapper,
  ) {}
  @Get('')
  async getAll(
    @Query() dto: QuotaCompanyQueryDto,
  ): Promise<ResponseResult<QuotaCompanyResponse>> {
    const result = await this._quotaCompanyService.getAll(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Get(':id')
  async getOne(
    @Param('id') id: number,
  ): Promise<ResponseResult<QuotaCompanyResponse>> {
    const result = await this._quotaCompanyService.getOne(id);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Post('')
  async create(
    @Body() dto: CreateQuotaCompanyDto,
  ): Promise<ResponseResult<QuotaCompanyResponse>> {
    const result = await this._quotaCompanyService.create(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateQuotaCompanyDto,
  ): Promise<ResponseResult<QuotaCompanyResponse>> {
    const result = await this._quotaCompanyService.update(id, dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this._quotaCompanyService.delete(id);
  }
}
