import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { EntityManager } from 'typeorm';
import { IncreaseBudgetEntity } from '../../entities/increase-budget.entity';
import { CreateIncreaseBudgetDto } from '@src/modules/manage/application/dto/create/increaseBudget/create.dto';
import { IncreaseBudgetQueryDto } from '@src/modules/manage/application/dto/query/increase-budget.dto';
import { UpdateIncreaseBudgetDto } from '@src/modules/manage/application/dto/create/increaseBudget/update.dto';

export interface IIncreaseBudgetServiceInterface {
  getAll(
    dto: IncreaseBudgetQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<IncreaseBudgetEntity>>;

  getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<IncreaseBudgetEntity>>;

  create(
    dto: CreateIncreaseBudgetDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<IncreaseBudgetEntity>>;

  update(
    id: number,
    dto: UpdateIncreaseBudgetDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<IncreaseBudgetEntity>>;

  //   delete(id: number, manager?: EntityManager): Promise<void>;
}
