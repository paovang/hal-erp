import { Controller, Get, Inject, Query } from '@nestjs/common';
import { PROVINCE_APPLICATION_SERVICE } from '../application/constants/inject-key.const';
import { TRANSFORM_RESULT_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransformResultService } from '@src/common/application/interfaces/transform-result-service.interface';
import { IProvinceServiceInterface } from '../domain/ports/input/province-domain-service.interface';
import { ProvinceDataMapper } from '../application/mappers/province.mapper';
import { ProvinceQueryDto } from '../application/dto/query/province.dto';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ProvinceResponse } from '../application/dto/response/province.response';

@Controller('provinces')
export class ProvinceController {
  constructor(
    @Inject(PROVINCE_APPLICATION_SERVICE)
    private readonly _provinceService: IProvinceServiceInterface,
    @Inject(TRANSFORM_RESULT_SERVICE)
    private readonly _transformResultService: ITransformResultService,
    private readonly _dataMapper: ProvinceDataMapper,
  ) {}

  @Get('')
  async getAll(
    @Query() dto: ProvinceQueryDto,
  ): Promise<ResponseResult<ProvinceResponse>> {
    const result = await this._provinceService.getAll(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }
}
