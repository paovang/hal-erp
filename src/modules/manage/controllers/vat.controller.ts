import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { TRANSFORM_RESULT_SERVICE } from '@src/common/constants/inject-key.const';
import { VAT_APPLICATION_SERVICE } from '../application/constants/inject-key.const';
import { ITransformResultService } from '@src/common/application/interfaces/transform-result-service.interface';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { VatDataMapper } from '../application/mappers/vat.mapper';
import { IVatServiceInterface } from '../domain/ports/input/vat-domain-service.interface';
import { VatQueryDto } from '../application/dto/query/vat-query.dto';
import { VatResponse } from '../application/dto/response/vat.response';
import { UpdateVatDto } from '../application/dto/create/vat/update.dto';

@Controller('vat')
export class VatController {
  constructor(
    @Inject(VAT_APPLICATION_SERVICE)
    private readonly _vatService: IVatServiceInterface,
    @Inject(TRANSFORM_RESULT_SERVICE)
    private readonly _transformResultService: ITransformResultService,
    private readonly _dataMapper: VatDataMapper,
  ) {}

  @Get('')
  async getAll(
    @Query() dto: VatQueryDto,
  ): Promise<ResponseResult<VatResponse>> {
    const result = await this._vatService.getAll(dto);
    console.log('tou', result);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Get(':id')
  async getOne(@Param('id') id: number): Promise<ResponseResult<VatResponse>> {
    const result = await this._vatService.getOne(id);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateVatDto,
  ): Promise<ResponseResult<VatResponse>> {
    const result = await this._vatService.update(id, dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this._vatService.delete(id);
  }
}
