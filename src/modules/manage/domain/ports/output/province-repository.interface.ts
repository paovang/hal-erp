import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { EntityManager } from 'typeorm';
import { ProvinceEntity } from '../../entities/province.entity';
import { ProvinceQueryDto } from '@src/modules/manage/application/dto/query/province.dto';

export interface IReadProvinceRepository {
  findAll(
    query: ProvinceQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<ProvinceEntity>>;

  //   findOne(
  //     id: PositionId,
  //     manager: EntityManager,
  //   ): Promise<ResponseResult<PositionEntity>>;
}
