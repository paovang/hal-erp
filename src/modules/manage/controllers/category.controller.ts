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
import { CATEGORY_APPLICATION_SERVICE } from '../application/constants/inject-key.const';
import { TRANSFORM_RESULT_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransformResultService } from '@src/common/application/interfaces/transform-result-service.interface';
import { ICategoryServiceInterface } from '../domain/ports/input/category-domain-service.interface';
import { CategoryDataMapper } from '../application/mappers/category.mapper';
import { CreateCategoryDto } from '../application/dto/create/category/create.dto';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { CategoryResponse } from '../application/dto/response/category.response';
import { CategoryQueryDto } from '../application/dto/query/category-query.dto';
import { UpdateCategoryDto } from '../application/dto/create/category/update.dto';
import { Public } from '@core-system/auth';

@Controller('categories')
export class CategoryController {
  constructor(
    @Inject(CATEGORY_APPLICATION_SERVICE)
    private readonly _categoryService: ICategoryServiceInterface,
    @Inject(TRANSFORM_RESULT_SERVICE)
    private readonly _transformResultService: ITransformResultService,
    private readonly _dataMapper: CategoryDataMapper,
  ) {}

  /** Create */
  @Public()
  @Post('')
  async create(
    @Body() dto: CreateCategoryDto,
  ): Promise<ResponseResult<CategoryResponse>> {
    const result = await this._categoryService.create(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Public()
  @Get('')
  async getAll(
    @Query() dto: CategoryQueryDto,
  ): Promise<ResponseResult<CategoryResponse>> {
    const result = await this._categoryService.getAll(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Public()
  @Get(':id')
  async getOne(
    @Param('id') id: number,
  ): Promise<ResponseResult<CategoryResponse>> {
    const result = await this._categoryService.getOne(id);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Public()
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateCategoryDto,
  ): Promise<ResponseResult<CategoryResponse>> {
    const result = await this._categoryService.update(id, dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Public()
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this._categoryService.delete(id);
  }
}
