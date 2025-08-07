import { Body, Controller, Inject, Post } from '@nestjs/common';
import { INCREASE_BUDGET_APPLICATION_SERVICE } from '../application/constants/inject-key.const';
import { TRANSFORM_RESULT_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransformResultService } from '@src/common/application/interfaces/transform-result-service.interface';
import { IIncreaseBudgetServiceInterface } from '../domain/ports/input/increase-budget-domain.interface';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { IncreaseBudgetResponse } from '../application/dto/response/increase-budget.response';
import { CreateIncreaseBudgetDto } from '../application/dto/create/increaseBudgetFile/create.dto';
import { IncreaseBudgetDataMapper } from '../application/mappers/increase-budget.mapper';

@Controller('increase-budgets')
export class IncreaseBudgetController {
  constructor(
    @Inject(INCREASE_BUDGET_APPLICATION_SERVICE)
    private readonly _increaseBudgetService: IIncreaseBudgetServiceInterface,
    @Inject(TRANSFORM_RESULT_SERVICE)
    private readonly _transformResultService: ITransformResultService,
    private readonly _dataMapper: IncreaseBudgetDataMapper,
  ) {}

  @Post('')
  async create(
    @Body() dto: CreateIncreaseBudgetDto,
  ): Promise<ResponseResult<IncreaseBudgetResponse>> {
    const result = await this._increaseBudgetService.create(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }
}
