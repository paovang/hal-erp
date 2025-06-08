import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { BUDGET_ITEM_APPLICATION_SERVICE } from '../application/constants/inject-key.const';
import { TRANSFORM_RESULT_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransformResultService } from '@src/common/application/interfaces/transform-result-service.interface';
import { BudgetItemResponse } from '../application/dto/response/budget-item.response';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CreateBudgetItemDto } from '../application/dto/create/BudgetItem/create.dto';
import { IBudgetItemServiceInterface } from '../domain/ports/input/budget-item-domain-service.interface';
import { BudgetItemDataMapper } from '../application/mappers/budget-item.mapper';
import { BudgetItemQueryDto } from '../application/dto/query/budget-item.dto';

@Controller('budget-items')
export class BudgetItemController {
  constructor(
    @Inject(BUDGET_ITEM_APPLICATION_SERVICE)
    private readonly _budgetItemService: IBudgetItemServiceInterface,
    @Inject(TRANSFORM_RESULT_SERVICE)
    private readonly _transformResultService: ITransformResultService,
    private readonly _dataMapper: BudgetItemDataMapper,
  ) {}

  /** Create */
  @Post('')
  async create(
    @Body() dto: CreateBudgetItemDto,
  ): Promise<ResponseResult<BudgetItemResponse>> {
    const result = await this._budgetItemService.create(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Get('')
  async getAll(
    @Query() dto: BudgetItemQueryDto,
  ): Promise<ResponseResult<BudgetItemResponse>> {
    const result = await this._budgetItemService.getAll(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Get(':id')
  async getOne(
    @Param('id') id: number,
  ): Promise<ResponseResult<BudgetItemResponse>> {
    const result = await this._budgetItemService.getOne(id);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }
}
