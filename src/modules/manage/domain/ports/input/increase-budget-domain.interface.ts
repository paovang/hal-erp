import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CreateIncreaseBudgetDto } from '@src/modules/manage/application/dto/create/increaseBudgetFile/create.dto';
import { EntityManager } from 'typeorm';
import { IncreaseBudgetEntity } from '../../entities/increase-budget.entity';

export interface IIncreaseBudgetServiceInterface {
  //   getAll(
  //     dto: PositionQueryDto,
  //     manager?: EntityManager,
  //   ): Promise<ResponseResult<PositionEntity>>;
  //   getOne(
  //     id: number,
  //     manager?: EntityManager,
  //   ): Promise<ResponseResult<PositionEntity>>;
  create(
    dto: CreateIncreaseBudgetDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<IncreaseBudgetEntity>>;
  //   update(
  //     id: number,
  //     dto: UpdatePositionDto,
  //     manager?: EntityManager,
  //   ): Promise<ResponseResult<PositionEntity>>;
  //   delete(id: number, manager?: EntityManager): Promise<void>;
}
