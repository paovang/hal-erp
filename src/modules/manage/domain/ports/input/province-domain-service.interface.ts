import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { EntityManager } from 'typeorm';
import { ProvinceEntity } from '../../entities/province.entity';
import { PositionQueryDto } from '@src/modules/manage/application/dto/query/position-query.dto';

export interface IProvinceServiceInterface {
  getAll(
    dto: PositionQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ProvinceEntity>>;

  //   getOne(
  //     id: number,
  //     manager?: EntityManager,
  //   ): Promise<ResponseResult<PositionEntity>>;
}
