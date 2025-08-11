import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { DepartmentUserEntity } from '@src/modules/manage/domain/entities/department-user.entity';
import { HttpStatus, Inject } from '@nestjs/common';
import { READ_DEPARTMENT_USER_REPOSITORY } from '../../../constants/inject-key.const';
import { IReadDepartmentUserRepository } from '@src/modules/manage/domain/ports/output/department-user-repository.interface';
import { DepartmentUserId } from '@src/modules/manage/domain/value-objects/department-user-id.vo';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { DepartmentUserOrmEntity } from '@src/common/infrastructure/database/typeorm/department-user.orm';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { GetAllByDepartmentQuery } from '../get-all-by-department.query';

@QueryHandler(GetAllByDepartmentQuery)
export class GetAllByDepartmentQueryHandler
  implements
    IQueryHandler<GetAllByDepartmentQuery, ResponseResult<DepartmentUserEntity>>
{
  constructor(
    @Inject(READ_DEPARTMENT_USER_REPOSITORY)
    private readonly _readRepo: IReadDepartmentUserRepository,
  ) {}

  async execute(
    query: GetAllByDepartmentQuery,
  ): Promise<ResponseResult<DepartmentUserEntity>> {
    if (isNaN(query.department_id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
      );
    }
    await findOneOrFail(query.manager, DepartmentUserOrmEntity, {
      department_id: query.department_id,
    });
    return await this._readRepo.findAllByDepartment(
      new DepartmentUserId(query.department_id),
      query.manager,
    );
  }
}
