import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import { ROLE_APPLICATION_SERVICE } from '../application/constants/inject-key.const';
import { TRANSFORM_RESULT_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransformResultService } from '@src/common/application/interfaces/transform-result-service.interface';
import { IRoleServiceInterface } from '../domain/ports/input/role-domain-service.interface';
import { RoleDataMapper } from '../application/mappers/role.mapper';
import { RoleQueryDto } from '../application/dto/query/role-query.dto';
import { ResponseResult } from '@src/common/application/interfaces/pagination.interface';
import { RoleResponse } from '../application/dto/response/role.response';

@Controller('roles')
export class RoleController {
  constructor(
    @Inject(ROLE_APPLICATION_SERVICE)
    private readonly _roleService: IRoleServiceInterface,
    @Inject(TRANSFORM_RESULT_SERVICE)
    private readonly _transformResultService: ITransformResultService,
    private readonly _dataMapper: RoleDataMapper,
  ) {}

  @Get('')
  async getAll(
    @Query() dto: RoleQueryDto,
  ): Promise<ResponseResult<RoleResponse>> {
    const result = await this._roleService.getAll(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Get(':id')
  async getOne(@Param('id') id: number): Promise<ResponseResult<RoleResponse>> {
    const result = await this._roleService.getOne(id);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }
}
