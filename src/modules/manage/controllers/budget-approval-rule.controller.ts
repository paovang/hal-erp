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
import { BUDGET_APPROVAL_RULE_APPLICATION_SERVICE } from '../application/constants/inject-key.const';
import { TRANSFORM_RESULT_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransformResultService } from '@src/common/application/interfaces/transform-result-service.interface';
import { IBudgetApprovalRuleServiceInterface } from '../domain/ports/input/budget-approval-rule-service.interface';
import { BudgetApprovalRuleDataMapper } from '../application/mappers/budget-approval-rule.mapper';
import { BudgetApprovalRuleResponse } from '../application/dto/response/budget-approval-rule.response';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CreateBudgetApprovalRuleDto } from '../application/dto/create/BudgetApprovalRule/create.dto';
import { BudgetApprovalRuleQueryDto } from '../application/dto/query/budget-approval-rule.dto';
import { UpdateBudgetApprovalRuleDto } from '../application/dto/create/BudgetApprovalRule/update.dto';

@Controller('budget-approval-rules')
export class BudgetApprovalRuleController {
  constructor(
    @Inject(BUDGET_APPROVAL_RULE_APPLICATION_SERVICE)
    private readonly _budgetApprovalRuleService: IBudgetApprovalRuleServiceInterface,
    @Inject(TRANSFORM_RESULT_SERVICE)
    private readonly _transformResultService: ITransformResultService,
    private readonly _dataMapper: BudgetApprovalRuleDataMapper,
  ) {}

  @Post('')
  async create(
    @Body() dto: CreateBudgetApprovalRuleDto,
  ): Promise<ResponseResult<BudgetApprovalRuleResponse>> {
    const result = await this._budgetApprovalRuleService.create(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Get('')
  async getAll(
    @Query() dto: BudgetApprovalRuleQueryDto,
  ): Promise<ResponseResult<BudgetApprovalRuleResponse>> {
    const result = await this._budgetApprovalRuleService.getAll(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Get(':id')
  async getOne(
    @Param('id') id: number,
  ): Promise<ResponseResult<BudgetApprovalRuleResponse>> {
    const result = await this._budgetApprovalRuleService.getOne(id);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateBudgetApprovalRuleDto,
  ): Promise<ResponseResult<BudgetApprovalRuleResponse>> {
    const result = await this._budgetApprovalRuleService.update(id, dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this._budgetApprovalRuleService.delete(id);
  }
}
