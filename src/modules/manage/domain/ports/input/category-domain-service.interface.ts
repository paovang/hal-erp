import { ResponseResult } from '@src/common/application/interfaces/pagination.interface';
import { EntityManager } from 'typeorm';
import { CategoryEntity } from '../../entities/category.entity';
import { CreateCategoryDto } from '@src/modules/manage/application/dto/create/category/create.dto';
import { CategoryQueryDto } from '@src/modules/manage/application/dto/query/category-query.dto';
import { UpdateCategoryDto } from '@src/modules/manage/application/dto/create/category/update.dto';

export interface ICategoryServiceInterface {
  getAll(
    dto: CategoryQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<CategoryEntity>>;

  getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<CategoryEntity>>;

  create(
    dto: CreateCategoryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<CategoryEntity>>;

  update(
    id: number,
    dto: UpdateCategoryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<CategoryEntity>>;

  delete(id: number, manager?: EntityManager): Promise<void>;
}
