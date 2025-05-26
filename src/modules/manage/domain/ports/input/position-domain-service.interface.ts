import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { CreatePositionDto } from '@src/modules/manage/application/dto/create/position/create.dto';
import { EntityManager } from 'typeorm';
import { PositionEntity } from '../../entities/position.entity';
import { PositionQueryDto } from '@src/modules/manage/application/dto/query/position-query.dto';
import { UpdatePositionDto } from '@src/modules/manage/application/dto/create/position/update.dto';

export interface IPositionServiceInterface {
  getAll(
    dto: PositionQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<PositionEntity>>;

  getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<PositionEntity>>;

  create(
    dto: CreatePositionDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<PositionEntity>>;

  update(
    id: number,
    dto: UpdatePositionDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<PositionEntity>>;

  delete(id: number, manager?: EntityManager): Promise<void>;
}
