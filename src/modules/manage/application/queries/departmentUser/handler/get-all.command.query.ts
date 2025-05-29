import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllQuery } from '../get-all.query';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { DepartmentUserEntity } from '@src/modules/manage/domain/entities/department-user.entity';
import { READ_DEPARTMENT_USER_REPOSITORY } from '../../../constants/inject-key.const';
import { HttpStatus, Inject } from '@nestjs/common';
import { IReadDepartmentUserRepository } from '@src/modules/manage/domain/ports/output/department-user-repository.interface';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';

@QueryHandler(GetAllQuery)
export class GetAllQueryHandler
  implements IQueryHandler<GetAllQuery, ResponseResult<DepartmentUserEntity>>
{
  constructor(
    @Inject(READ_DEPARTMENT_USER_REPOSITORY)
    private readonly _readRepo: IReadDepartmentUserRepository,
  ) {}

  async execute(
    query: GetAllQuery,
  ): Promise<ResponseResult<DepartmentUserEntity>> {
    const data = await this._readRepo.findAll(query.dto, query.manager);
    if (!data) {
      throw new ManageDomainException('error.not_found', HttpStatus.NOT_FOUND);
    }

    return data;
  }
}
