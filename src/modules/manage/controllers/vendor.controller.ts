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
import { ITransformResultService } from '@src/common/application/interfaces/transform-result-service.interface';
import { IVendorServiceInterface } from '../domain/ports/input/vendor-domain-service.interface';
import { VendorDataMapper } from '../application/mappers/vendor.mapper';
import { CreateVendorDto } from '../application/dto/create/vendor/create.dto';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { VendorResponse } from '../application/dto/response/vendor.response';
import { VENDOR_APPLICATION_SERVICE } from '../application/constants/inject-key.const';
import { VendorQueryDto } from '../application/dto/query/vendor-query.dto';
import { UpdateVendorDto } from '../application/dto/create/vendor/update.dto';

@Controller('vendors')
export class VendorController {
  constructor(
    @Inject(VENDOR_APPLICATION_SERVICE)
    private readonly _vendorService: IVendorServiceInterface,
    @Inject(TRANSFORM_RESULT_SERVICE)
    private readonly _transformResultService: ITransformResultService,
    private readonly _dataMapper: VendorDataMapper,
  ) {}

  @Post('')
  async create(
    @Body() dto: CreateVendorDto,
  ): Promise<ResponseResult<VendorResponse>> {
    const result = await this._vendorService.create(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Get('')
  async getAll(
    @Query() dto: VendorQueryDto,
  ): Promise<ResponseResult<VendorResponse>> {
    const result = await this._vendorService.getAll(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Get(':id')
  async getOne(
    @Param('id') id: number,
  ): Promise<ResponseResult<VendorResponse>> {
    const result = await this._vendorService.getOne(id);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateVendorDto,
  ): Promise<ResponseResult<VendorResponse>> {
    const result = await this._vendorService.update(id, dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this._vendorService.delete(id);
  }
}
