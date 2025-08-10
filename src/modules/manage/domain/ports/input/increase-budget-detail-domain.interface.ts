import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CreateIncreaseBudgetDetailDto } from '@src/modules/manage/application/dto/create/increaseBudgetDetail/create.dto';
import { EntityManager } from 'typeorm';
import { IncreaseBudgetDetailEntity } from '../../entities/increase-budget-detail.entity';
import { IncreaseBudgetDetailQueryDto } from '@src/modules/manage/application/dto/query/increase-budget-detail.dto';
import { UpdateIncreaseBudgetDetailDto } from '@src/modules/manage/application/dto/create/increaseBudgetDetail/update.dto';

export interface IIncreaseBudgetDetailServiceInterface {
  getAll(
    id: number,
    dto: IncreaseBudgetDetailQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<IncreaseBudgetDetailEntity>>;

  getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<IncreaseBudgetDetailEntity>>;

  create(
    id: number,
    dto: CreateIncreaseBudgetDetailDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<IncreaseBudgetDetailEntity>>;

  update(
    id: number,
    dto: UpdateIncreaseBudgetDetailDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<IncreaseBudgetDetailEntity>>;

  delete(id: number, manager?: EntityManager): Promise<void>;
}
