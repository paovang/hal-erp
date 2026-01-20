import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import { PERMISSION_APPLICATION_SERVICE } from '../application/constants/inject-key.const';
import { TRANSFORM_RESULT_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransformResultService } from '@src/common/application/interfaces/transform-result-service.interface';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { PermissionQueryDto } from '../application/dto/query/permission-query.dto';
import { IPermissionServiceInterface } from '../domain/ports/input/permission-domain-service.interface';
import { PermissionGroupResponse } from '../application/dto/response/permission.response';
import { PermissionDataMapper } from '../application/mappers/permission.mapper';

@Controller('permissions')
export class PermissionController {
  constructor(
    @Inject(PERMISSION_APPLICATION_SERVICE)
    private readonly _roleService: IPermissionServiceInterface,
    @Inject(TRANSFORM_RESULT_SERVICE)
    private readonly _transformResultService: ITransformResultService,
    private readonly _dataMapper: PermissionDataMapper,
  ) {}

  @Get('')
  async getAll(
    @Query() dto: PermissionQueryDto,
  ): Promise<ResponseResult<PermissionGroupResponse>> {
    const result = await this._roleService.getAll(dto);
    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Get(':id')
  async getOne(
    @Param('id') id: number,
  ): Promise<ResponseResult<PermissionGroupResponse>> {
    const result = await this._roleService.getOne(id);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }
}
