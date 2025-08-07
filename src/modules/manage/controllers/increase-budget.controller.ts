import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { INCREASE_BUDGET_APPLICATION_SERVICE } from '../application/constants/inject-key.const';
import { TRANSFORM_RESULT_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransformResultService } from '@src/common/application/interfaces/transform-result-service.interface';
import { IIncreaseBudgetServiceInterface } from '../domain/ports/input/increase-budget-domain.interface';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { IncreaseBudgetResponse } from '../application/dto/response/increase-budget.response';
import { IncreaseBudgetDataMapper } from '../application/mappers/increase-budget.mapper';
import { CreateIncreaseBudgetDto } from '../application/dto/create/increaseBudget/create.dto';
import { IncreaseBudgetQueryDto } from '../application/dto/query/increase-budget.dto';
import { UpdateIncreaseBudgetDto } from '../application/dto/create/increaseBudget/update.dto';

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

  @Get('')
  async getAll(
    @Query() dto: IncreaseBudgetQueryDto,
  ): Promise<ResponseResult<IncreaseBudgetResponse>> {
    const result = await this._increaseBudgetService.getAll(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Get(':id')
  async getOne(
    @Param('id') id: number,
  ): Promise<ResponseResult<IncreaseBudgetResponse>> {
    const result = await this._increaseBudgetService.getOne(id);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateIncreaseBudgetDto,
  ): Promise<ResponseResult<IncreaseBudgetResponse>> {
    const result = await this._increaseBudgetService.update(id, dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }
}
