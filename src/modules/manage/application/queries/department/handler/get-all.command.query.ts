import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetAllQuery } from '../get-all.query';
import { READ_DEPARTMENT_REPOSITORY } from '@src/modules/manage/application/constants/inject-key.const';
import { Inject } from '@nestjs/common';
import { DepartmentEntity } from '@src/modules/manage/domain/entities/department.entity';
import { IReadDepartmentRepository } from '@src/modules/manage/domain/ports/output/department-repository.interface';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { UserContextService } from '@src/common/utils/services/cls/cls.service';

@QueryHandler(GetAllQuery)
export class GetAllQueryHandler
  implements IQueryHandler<GetAllQuery, ResponseResult<DepartmentEntity>>
{
  constructor(
    @Inject(READ_DEPARTMENT_REPOSITORY)
    private readonly _readRepo: IReadDepartmentRepository,
    private readonly _userContextService: UserContextService,
  ) {}

  async execute(query: GetAllQuery): Promise<ResponseResult<DepartmentEntity>> {
    const user = this._userContextService.getAuthUser()?.user;
    const departmentUser =
      this._userContextService.getAuthUser()?.departmentUser;
    console.log('Auth User:', user);
    console.log('Auth Department User:', departmentUser);

    return await this._readRepo.findAll(query.dto, query.manager);
  }
}
