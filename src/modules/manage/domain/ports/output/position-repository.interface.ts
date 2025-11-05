import { EntityManager } from 'typeorm';
import { PositionEntity } from '../../entities/position.entity';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { PositionQueryDto } from '@src/modules/manage/application/dto/query/position-query.dto';
import { PositionId } from '../../value-objects/position-id.vo';

export interface IWritePositionRepository {
  create(
    entity: PositionEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<PositionEntity>>;

  update(
    entity: PositionEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<PositionEntity>>;

  delete(id: PositionId, manager: EntityManager): Promise<void>;
}

export interface IReadPositionRepository {
  findAll(
    query: PositionQueryDto,
    manager: EntityManager,
    company_id?: number,
    roles?: string[],
  ): Promise<ResponseResult<PositionEntity>>;

  findOne(
    id: PositionId,
    manager: EntityManager,
  ): Promise<ResponseResult<PositionEntity>>;
}
