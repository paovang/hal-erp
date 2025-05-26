import { EntityManager } from 'typeorm';
import { CategoryEntity } from '../../entities/category.entity';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { CategoryQueryDto } from '@src/modules/manage/application/dto/query/category-query.dto';
import { CategoryId } from '../../value-objects/category-id.vo';

export interface IReadCategoryRepository {
  findAll(
    query: CategoryQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<CategoryEntity>>;

  findOne(
    id: CategoryId,
    manager: EntityManager,
  ): Promise<ResponseResult<CategoryEntity>>;
}

export interface IWriteCategoryRepository {
  create(
    entity: CategoryEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<CategoryEntity>>;

  update(
    entity: CategoryEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<CategoryEntity>>;

  delete(id: CategoryId, manager: EntityManager): Promise<void>;
}
