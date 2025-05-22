import { Body, Controller, Get, Inject, Post, Query } from "@nestjs/common";
import { ITransformResultService } from "@src/common/application/interfaces/transform-result-service.interface";
import { TRANSFORM_RESULT_SERVICE } from "@src/common/constants/inject-key.const";
import { DEPARTMENT_USER_APPLICATION_SERVICE } from "../application/constants/inject-key.const";
import { CreateDepartmentUserDto } from "../application/dto/create/departmentUser/create.dto";
import { ResponseResult } from "@src/common/application/interfaces/pagination.interface";
import { IDepartmentUserServiceInterface } from "../domain/ports/input/department-user-domain-service.interface";
import { DepartmentUserDataMapper } from "../application/mappers/department-user.mapper";
import { DepartmentUserResponse } from "../application/dto/response/department-user.response";
import { DepartmentUserQueryDto } from "../application/dto/query/department-user-query.dto";

@Controller('department-users')
export class DepartmentUserController {
  constructor(
    @Inject(DEPARTMENT_USER_APPLICATION_SERVICE)
    private readonly _departmentUserService: IDepartmentUserServiceInterface,
    @Inject(TRANSFORM_RESULT_SERVICE)
    private readonly _transformResultService: ITransformResultService,
    private readonly _dataMapper: DepartmentUserDataMapper,
  ) {}

  @Post('')
  async create(
      @Body() dto: CreateDepartmentUserDto,
  ): Promise<ResponseResult<DepartmentUserResponse>> {
      const result = await this._departmentUserService.create(dto);
  
      return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
      );
  }

  @Get('')
  async getAll(
    @Query() dto: DepartmentUserQueryDto,
  ): Promise<ResponseResult<DepartmentUserResponse>> {
    const result = await this._departmentUserService.getAll(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }
}