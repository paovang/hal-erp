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
import { BUDGET_ACCOUNT_APPLICATION_SERVICE } from '../application/constants/inject-key.const';
import { CreateBudgetAccountDto } from '../application/dto/create/budgetAccount/create.dto';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { BudgetAccountResponse } from '../application/dto/response/budget-account.response';
import { TRANSFORM_RESULT_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransformResultService } from '@src/common/application/interfaces/transform-result-service.interface';
import { BudgetAccountDataMapper } from '../application/mappers/budget-account.mapper';
import { IBudgetAccountServiceInterface } from '../domain/ports/input/budget-account-service.interface';
import { BudgetAccountQueryDto } from '../application/dto/query/budget-account.dto';
import { UpdateBudgetAccountDto } from '../application/dto/create/budgetAccount/update.dto';

@Controller('budget-accounts')
export class BudgetAccountController {
  constructor(
    @Inject(BUDGET_ACCOUNT_APPLICATION_SERVICE)
    private readonly _budgetAccountService: IBudgetAccountServiceInterface,
    @Inject(TRANSFORM_RESULT_SERVICE)
    private readonly _transformResultService: ITransformResultService,
    private readonly _dataMapper: BudgetAccountDataMapper,
  ) {}

  /** Create */
  @Post('')
  async create(
    @Body() dto: CreateBudgetAccountDto,
  ): Promise<ResponseResult<BudgetAccountResponse>> {
    const result = await this._budgetAccountService.create(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Get('')
  async getAll(
    @Query() dto: BudgetAccountQueryDto,
  ): Promise<ResponseResult<BudgetAccountResponse>> {
    const result = await this._budgetAccountService.getAll(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Get(':id')
  async getOne(
    @Param('id') id: number,
  ): Promise<ResponseResult<BudgetAccountResponse>> {
    const result = await this._budgetAccountService.getOne(id);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateBudgetAccountDto,
  ): Promise<ResponseResult<BudgetAccountResponse>> {
    const result = await this._budgetAccountService.update(id, dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this._budgetAccountService.delete(id);
  }
}
