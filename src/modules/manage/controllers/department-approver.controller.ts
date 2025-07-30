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
import {
  CreateDepartmentApproverByUserDto,
  CreateDepartmentApproverDto,
} from '../application/dto/create/departmentApprover/create.dto';
import { IDepartmentApproverServiceInterface } from '../domain/ports/input/department-approver-domian-service.interface';
import { ITransformResultService } from '@src/common/application/interfaces/transform-result-service.interface';
import { DepartmentApproverDataMapper } from '../application/mappers/department-approver.mapper';
import { DepartmentApproverResponse } from '../application/dto/response/department-approver.response';
import { DepartmentApproverQueryDto } from '../application/dto/query/department-approver.dto';
import {
  UpdateDepartmentApproverByUserDto,
  UpdateDepartmentApproverDto,
} from '../application/dto/create/departmentApprover/update.dto';

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
  @Post('/by/user')
  async createByUser(
    @Body() dto: CreateDepartmentApproverByUserDto,
  ): Promise<ResponseResult<DepartmentApproverResponse>> {
    const result = await this._departmentApproverService.createByUser(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

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
  @Put('/by/user/:id')
  async updateByUser(
    @Param('id') id: number,
    @Body() dto: UpdateDepartmentApproverByUserDto,
  ): Promise<ResponseResult<DepartmentApproverResponse>> {
    const result = await this._departmentApproverService.updateByUser(id, dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this._departmentApproverService.delete(id);
  }
}
