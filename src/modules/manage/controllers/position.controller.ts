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
import { POSITION_APPLICATION_SERVICE } from '../application/constants/inject-key.const';
import { TRANSFORM_RESULT_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransformResultService } from '@src/common/application/interfaces/transform-result-service.interface';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { CreatePositionDto } from '../application/dto/create/position/create.dto';
import { IPositionServiceInterface } from '../domain/ports/input/position-domain-service.interface';
import { PositionDataMapper } from '../application/mappers/position.mapper';
import { PositionResponse } from '../application/dto/response/position.response';
import { PositionQueryDto } from '../application/dto/query/position-query.dto';
import { UpdatePositionDto } from '../application/dto/create/position/update.dto';

@Controller('positions')
export class PositionController {
  constructor(
    @Inject(POSITION_APPLICATION_SERVICE)
    private readonly _positionService: IPositionServiceInterface,
    @Inject(TRANSFORM_RESULT_SERVICE)
    private readonly _transformResultService: ITransformResultService,
    private readonly _dataMapper: PositionDataMapper,
  ) {}

  @Post('')
  async create(
    @Body() dto: CreatePositionDto,
  ): Promise<ResponseResult<PositionResponse>> {
    const result = await this._positionService.create(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Get('')
  async getAll(
    @Query() dto: PositionQueryDto,
  ): Promise<ResponseResult<PositionResponse>> {
    const result = await this._positionService.getAll(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Get(':id')
  async getOne(
    @Param('id') id: number,
  ): Promise<ResponseResult<PositionResponse>> {
    const result = await this._positionService.getOne(id);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdatePositionDto,
  ): Promise<ResponseResult<PositionResponse>> {
    const result = await this._positionService.update(id, dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this._positionService.delete(id);
  }
}
