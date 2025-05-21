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
import { DEPARTMENT_APPLICATION_SERVICE } from '@src/modules/manage/application/constants/inject-key.const';
import { DepartmentQueryDto } from '@src/modules/manage/application/dto/query/department-query.dto';
import { IDepartmentServiceInterface } from '@src/modules/manage/domain/ports/input/department-domain-service.interface';
import { DepartmentResponse } from '@src/modules/manage/application/dto/response/department.response';
import { ResponseResult } from '@src/common/application/interfaces/pagination.interface';
import { ITransformResultService } from '@src/common/application/interfaces/transform-result-service.interface';
import { TRANSFORM_RESULT_SERVICE } from '@src/common/constants/inject-key.const';
import { DepartmentDataMapper } from '@src/modules/manage/application/mappers/department.mapper';
import { CreateDepartmentDto } from '@src/modules/manage/application/dto/create/department/create.dto';
import { UpdateDepartmentDto } from '@src/modules/manage/application/dto/create/department/update.dto';

@Controller('department')
export class DepartmentController {
  constructor(
    @Inject(DEPARTMENT_APPLICATION_SERVICE)
    private readonly _departmentService: IDepartmentServiceInterface,
    @Inject(TRANSFORM_RESULT_SERVICE)
    private readonly _transformResultService: ITransformResultService,
    private readonly _dataMapper: DepartmentDataMapper,
  ) {}

  /** Get All */
  @Get('')
  async getAll(
    @Query() dto: DepartmentQueryDto,
  ): Promise<ResponseResult<DepartmentResponse>> {
    const result = await this._departmentService.getAll(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  /** Get One */
  @Get(':id')
  async getOne(
    @Param('id') id: number,
  ): Promise<ResponseResult<DepartmentResponse>> {
    const result = await this._departmentService.getOne(id);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  /** Create */
  @Post('')
  async create(
    @Body() dto: CreateDepartmentDto,
  ): Promise<ResponseResult<DepartmentResponse>> {
    const result = await this._departmentService.create(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  /** Update */
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateDepartmentDto,
  ): Promise<ResponseResult<DepartmentResponse>> {
    const result = await this._departmentService.update(id, dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this._departmentService.delete(id);
  }
}
