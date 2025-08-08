import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { INCREASE_BUDGET_DETAIL_APPLICATION_SERVICE } from '../application/constants/inject-key.const';
import { TRANSFORM_RESULT_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransformResultService } from '@src/common/application/interfaces/transform-result-service.interface';
import { IncreaseBudgetDetailDataMapper } from '../application/mappers/increase-budget-detail.mapper';
import { IIncreaseBudgetDetailServiceInterface } from '../domain/ports/input/increase-budget-detail-domain.interface';
import { CreateIncreaseBudgetDetailDto } from '../application/dto/create/increaseBudgetDetail/create.dto';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { IncreaseBudgetDetailResponse } from '../application/dto/response/increase-budget-detail.response';
import { IncreaseBudgetDetailQueryDto } from '../application/dto/query/increase-budget-detail.dto';

@Controller('increase-budget-details')
export class IncreaseBudgetDetailController {
  constructor(
    @Inject(INCREASE_BUDGET_DETAIL_APPLICATION_SERVICE)
    private readonly _service: IIncreaseBudgetDetailServiceInterface,
    @Inject(TRANSFORM_RESULT_SERVICE)
    private readonly _transformResultService: ITransformResultService,
    private readonly _dataMapper: IncreaseBudgetDetailDataMapper,
  ) {}

  @Post('/:id')
  async create(
    @Param('id') id: number,
    @Body() dto: CreateIncreaseBudgetDetailDto,
  ): Promise<ResponseResult<IncreaseBudgetDetailResponse>> {
    const result = await this._service.create(id, dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Get('/:id')
  async getAll(
    @Param('id') id: number,
    @Query() dto: IncreaseBudgetDetailQueryDto,
  ): Promise<ResponseResult<IncreaseBudgetDetailResponse>> {
    const result = await this._service.getAll(id, dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }
}
