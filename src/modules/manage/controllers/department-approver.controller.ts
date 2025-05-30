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
import { TRANSFORM_RESULT_SERVICE } from '@src/common/constants/inject-key.const';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { DEPARTMENT_APPROVER_APPLICATION_SERVICE } from '../application/constants/inject-key.const';
import { CreateDepartmentApproverDto } from '../application/dto/create/departmentApprover/create.dto';
import { IDepartmentApproverServiceInterface } from '../domain/ports/input/department-approver-domian-service.interface';
import { ITransformResultService } from '@src/common/application/interfaces/transform-result-service.interface';
import { DepartmentApproverDataMapper } from '../application/mappers/department-approver.mapper';
import { DepartmentApproverResponse } from '../application/dto/response/department-approver.response';
import { DepartmentApproverQueryDto } from '../application/dto/query/department-approver.dto';
import { UpdateDepartmentApproverDto } from '../application/dto/create/departmentApprover/update.dto';
import { Public } from '@core-system/auth';

@Controller('department-approvers')
export class DepartmentApproverController {
  constructor(
    @Inject(DEPARTMENT_APPROVER_APPLICATION_SERVICE)
    private readonly _departmentApproverService: IDepartmentApproverServiceInterface,
    @Inject(TRANSFORM_RESULT_SERVICE)
    private readonly _transformResultService: ITransformResultService,
    private readonly _dataMapper: DepartmentApproverDataMapper,
  ) {}

  /** Create */
  @Public()
  @Post('')
  async create(
    @Body() dto: CreateDepartmentApproverDto,
  ): Promise<ResponseResult<DepartmentApproverResponse>> {
    const result = await this._departmentApproverService.create(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Public()
  @Get('')
  async getAll(
    @Query() dto: DepartmentApproverQueryDto,
  ): Promise<ResponseResult<DepartmentApproverResponse>> {
    const result = await this._departmentApproverService.getAll(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Public()
  @Get(':id')
  async getOne(
    @Param('id') id: number,
  ): Promise<ResponseResult<DepartmentApproverResponse>> {
    const result = await this._departmentApproverService.getOne(id);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Public()
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateDepartmentApproverDto,
  ): Promise<ResponseResult<DepartmentApproverResponse>> {
    const result = await this._departmentApproverService.update(id, dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Public()
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this._departmentApproverService.delete(id);
  }
}
