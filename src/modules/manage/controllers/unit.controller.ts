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
import { UNIT_APPLICATION_SERVICE } from '../application/constants/inject-key.const';
import { ITransformResultService } from '@src/common/application/interfaces/transform-result-service.interface';
import { IUnitServiceInterface } from '../domain/ports/input/unit-domain-service.interface';
import { UnitDataMapper } from '../application/mappers/unit.mapper';
import { ResponseResult } from '@src/common/application/interfaces/pagination.interface';
import { UnitResponse } from '../application/dto/response/unit.response';
import { CreateUnitDto } from '../application/dto/create/unit/create.dto';
import { UnitQueryDto } from '../application/dto/query/unit-query.dto';
import { UpdateUnitDto } from '../application/dto/create/unit/update.dto';

@Controller('units')
export class UnitController {
  constructor(
    @Inject(UNIT_APPLICATION_SERVICE)
    private readonly _unitService: IUnitServiceInterface,
    @Inject(TRANSFORM_RESULT_SERVICE)
    private readonly _transformResultService: ITransformResultService,
    private readonly _dataMapper: UnitDataMapper,
  ) {}

  @Post('')
  async create(
    @Body() dto: CreateUnitDto,
  ): Promise<ResponseResult<UnitResponse>> {
    const result = await this._unitService.create(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Get('')
  async getAll(
    @Query() dto: UnitQueryDto,
  ): Promise<ResponseResult<UnitResponse>> {
    const result = await this._unitService.getAll(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Get(':id')
  async getOne(@Param('id') id: number): Promise<ResponseResult<UnitResponse>> {
    const result = await this._unitService.getOne(id);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateUnitDto,
  ): Promise<ResponseResult<UnitResponse>> {
    const result = await this._unitService.update(id, dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this._unitService.delete(id);
  }
}
