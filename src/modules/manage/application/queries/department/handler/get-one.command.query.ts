import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { READ_DEPARTMENT_REPOSITORY } from '@src/modules/manage/application/constants/inject-key.const';
import { Inject } from '@nestjs/common';
import { DepartmentEntity } from '@src/modules/manage/domain/entities/department.entity';
import { IReadDepartmentRepository } from '@src/modules/manage/domain/ports/output/department-repository.interface';
import { ResponseResult } from '@src/common/application/interfaces/pagination.interface';
import { GetOneQuery } from '@src/modules/manage/application/queries/department/get-one.query';
import { DepartmentId } from '@src/modules/manage/domain/value-objects/department-id.vo';

@QueryHandler(GetOneQuery)
export class GetOneQueryHandler
  implements IQueryHandler<GetOneQuery, ResponseResult<DepartmentEntity>>
{
  constructor(
    @Inject(READ_DEPARTMENT_REPOSITORY)
    private readonly _readRepo: IReadDepartmentRepository,
  ) {}

  async execute(query: GetOneQuery): Promise<ResponseResult<DepartmentEntity>> {
    return await this._readRepo.findOne(
      new DepartmentId(query.id),
      query.manager,
    );
  }
}
