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
import { CURRENCY_APPLICATION_SERVICE } from '../application/constants/inject-key.const';
import { TRANSFORM_RESULT_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransformResultService } from '@src/common/application/interfaces/transform-result-service.interface';
import { ICurrencyServiceInterface } from '../domain/ports/input/currency-domain-service.interface';
import { CurrencyDataMapper } from '../application/mappers/currency.mapper';
import { CreateCurrencyDto } from '../application/dto/create/currency/create.dto';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CurrencyResponse } from '../application/dto/response/currency.response';
import { CurrencyQueryDto } from '../application/dto/query/currency-query.dto';
import { UpdateCurrencyDto } from '../application/dto/create/currency/update.dto';

@Controller('currencies')
export class CurrencyController {
  constructor(
    @Inject(CURRENCY_APPLICATION_SERVICE)
    private readonly _currencyService: ICurrencyServiceInterface,
    @Inject(TRANSFORM_RESULT_SERVICE)
    private readonly _transformResultService: ITransformResultService,
    private readonly _dataMapper: CurrencyDataMapper,
  ) {}

  @Post('')
  async create(
    @Body() dto: CreateCurrencyDto,
  ): Promise<ResponseResult<CurrencyResponse>> {
    const result = await this._currencyService.create(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Get('')
  async getAll(
    @Query() dto: CurrencyQueryDto,
  ): Promise<ResponseResult<CurrencyResponse>> {
    const result = await this._currencyService.getAll(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Get(':id')
  async getOne(
    @Param('id') id: number,
  ): Promise<ResponseResult<CurrencyResponse>> {
    const result = await this._currencyService.getOne(id);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateCurrencyDto,
  ): Promise<ResponseResult<CurrencyResponse>> {
    const result = await this._currencyService.update(id, dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this._currencyService.delete(id);
  }
}
