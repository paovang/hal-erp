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
import { EXCHANGE_RATE_APPLICATION_SERVICE } from '../application/constants/inject-key.const';
import { ITransformResultService } from '@src/common/application/interfaces/transform-result-service.interface';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { IExchangeRateServiceInterface } from '../domain/ports/input/exchange-rate-domain-service.interface';
import { UpdateExchangeRateDto } from '../application/dto/create/exchange-rates/update.dto';
import { ExchangeRateDataMapper } from '../application/mappers/exchange-rate.mapper';
import { CreateExchangeRateDto } from '../application/dto/create/exchange-rates/create.dto';
import { ExchangeRateResponse } from '../application/dto/response/exchange-rate.response';
import { ExchangeRateQueryDto } from '../application/dto/query/exchange-rate-query.dto';
import { TRANSFORM_RESULT_SERVICE } from '@src/common/constants/inject-key.const';

@Controller('exchange-rates')
export class ExchangeRateController {
  constructor(
    @Inject(EXCHANGE_RATE_APPLICATION_SERVICE)
    private readonly _exchangeRateService: IExchangeRateServiceInterface,
    @Inject(TRANSFORM_RESULT_SERVICE)
    private readonly _transformResultService: ITransformResultService,
    private readonly _dataMapper: ExchangeRateDataMapper,
  ) {}

  @Post('')
  async create(
    @Body() dto: CreateExchangeRateDto,
  ): Promise<ResponseResult<ExchangeRateResponse>> {
    const result = await this._exchangeRateService.create(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Get('')
  async getAll(
    @Query() dto: ExchangeRateQueryDto,
  ): Promise<ResponseResult<ExchangeRateResponse>> {
    const result = await this._exchangeRateService.getAll(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Get(':id')
  async getOne(
    @Param('id') id: number,
  ): Promise<ResponseResult<ExchangeRateResponse>> {
    const result = await this._exchangeRateService.getOne(id);
    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateExchangeRateDto,
  ): Promise<ResponseResult<ExchangeRateResponse>> {
    const result = await this._exchangeRateService.update(id, dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this._exchangeRateService.delete(id);
  }
}
