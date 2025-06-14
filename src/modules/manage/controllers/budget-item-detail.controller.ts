import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { BUDGET_ITEM_DETAIL_APPLICATION_SERVICE } from '../application/constants/inject-key.const';
import { TRANSFORM_RESULT_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransformResultService } from '@src/common/application/interfaces/transform-result-service.interface';
import { BudgetItemDetailDataMapper } from '../application/mappers/budget-item-detail.mapper';
import { IBudgetItemDetailServiceInterface } from '../domain/ports/input/budget-item-detail-domain-service.interface';
import { BudgetItemDetailResponse } from '../application/dto/response/budget-item-detail.response';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CreateBudgetItemDetailDto } from '../application/dto/create/BudgetItemDetail/create.dto';
import { BudgetItemDetailQueryDto } from '../application/dto/query/budget-item-detail.dto';

@Controller('budget-item-details')
export class BudgetItemDetailController {
  constructor(
    @Inject(BUDGET_ITEM_DETAIL_APPLICATION_SERVICE)
    private readonly _budgetItemDetailService: IBudgetItemDetailServiceInterface,
    @Inject(TRANSFORM_RESULT_SERVICE)
    private readonly _transformResultService: ITransformResultService,
    private readonly _dataMapper: BudgetItemDetailDataMapper,
  ) {}

  @Post('/:id')
  async create(
    @Param('id') id: number,
    @Body() dto: CreateBudgetItemDetailDto,
  ): Promise<ResponseResult<BudgetItemDetailResponse>> {
    const result = await this._budgetItemDetailService.create(id, dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Get('budget-item-id/:id')
  async getAll(
    @Param('id') id: number,
    @Query() dto: BudgetItemDetailQueryDto,
  ): Promise<ResponseResult<BudgetItemDetailResponse>> {
    const result = await this._budgetItemDetailService.getAll(id, dto);
    console.log('object', result);
    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Get('detail-id/:id')
  async getOne(
    @Param('id') id: number,
  ): Promise<ResponseResult<BudgetItemDetailResponse>> {
    const result = await this._budgetItemDetailService.getOne(id);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this._budgetItemDetailService.delete(id);
  }
}
