import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { READ_DEPARTMENT_REPOSITORY } from '@src/modules/manage/application/constants/inject-key.const';
import { HttpStatus, Inject } from '@nestjs/common';
import { DepartmentEntity } from '@src/modules/manage/domain/entities/department.entity';
import { IReadDepartmentRepository } from '@src/modules/manage/domain/ports/output/department-repository.interface';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { GetOneQuery } from '@src/modules/manage/application/queries/department/get-one.query';
import { DepartmentId } from '@src/modules/manage/domain/value-objects/department-id.vo';
import { DepartmentOrmEntity } from '@src/common/infrastructure/database/typeorm/department.orm';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';

@QueryHandler(GetOneQuery)
export class GetOneQueryHandler
  implements IQueryHandler<GetOneQuery, ResponseResult<DepartmentEntity>>
{
  constructor(
    @Inject(READ_DEPARTMENT_REPOSITORY)
    private readonly _readRepo: IReadDepartmentRepository,
  ) {}

  async execute(query: GetOneQuery): Promise<ResponseResult<DepartmentEntity>> {
    await this.checkData(query);
    return await this._readRepo.findOne(
      new DepartmentId(query.id),
      query.manager,
    );
  }

  async checkData(query: GetOneQuery): Promise<void> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
      );
    }
    await findOneOrFail(query.manager, DepartmentOrmEntity, {
      id: query.id,
    });
  }
}
