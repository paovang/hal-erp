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
import { ROLE_APPLICATION_SERVICE } from '../application/constants/inject-key.const';
import { TRANSFORM_RESULT_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransformResultService } from '@src/common/application/interfaces/transform-result-service.interface';
import { IRoleServiceInterface } from '../domain/ports/input/role-domain-service.interface';
import { RoleDataMapper } from '../application/mappers/role.mapper';
import { RoleQueryDto } from '../application/dto/query/role-query.dto';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { RoleResponse } from '../application/dto/response/role.response';
import { CreateRoleDto } from '../application/dto/create/user/role/create.dto';
import { UpdateRoleDto } from '../application/dto/create/user/role/update.dto';
import { CreateDto } from '../application/dto/create/user/role/create-role.dto';
import { UpdateDto } from '../application/dto/create/user/role/update-role.dto';

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

  @Get('company')
  async getAllForCompany(
    @Query() dto: RoleQueryDto,
  ): Promise<ResponseResult<RoleResponse>> {
    const result = await this._roleService.getAllForCompany(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Post('department')
  async create(
    @Body() dto: CreateRoleDto,
  ): Promise<ResponseResult<RoleResponse>> {
    const result = await this._roleService.create(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Put('department/:id')
  async updateRole(
    @Param('id') id: number,
    @Body() dto: UpdateRoleDto,
  ): Promise<ResponseResult<RoleResponse>> {
    const result = await this._roleService.update(id, dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Post('')
  async createRole(
    @Body() dto: CreateDto,
  ): Promise<ResponseResult<RoleResponse>> {
    const result = await this._roleService.createRole(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateDto,
  ): Promise<ResponseResult<RoleResponse>> {
    const result = await this._roleService.updateRole(id, dto);

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

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this._roleService.delete(id);
  }
}
