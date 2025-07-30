import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { CreateByUserCommand } from '../create.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { DepartmentApproverEntity } from '@src/modules/manage/domain/entities/department-approver.entity';
import { Inject } from '@nestjs/common';
import { WRITE_DEPARTMENT_APPROVER_REPOSITORY } from '../../../constants/inject-key.const';
import { DepartmentApproverDataMapper } from '../../../mappers/department-approver.mapper';
import { IWriteDepartmentApproverRepository } from '@src/modules/manage/domain/ports/output/department-approver-repositiory.interface';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorm/user.orm';
import { _checkColumnDuplicate } from '@src/common/utils/check-column-duplicate-orm.util';
import { DepartmentApproverOrmEntity } from '@src/common/infrastructure/database/typeorm/department-approver.orm';
import { DepartmentOrmEntity } from '@src/common/infrastructure/database/typeorm/department.orm';

@CommandHandler(CreateByUserCommand)
export class CreateByUserCommandHandler
  implements
    IQueryHandler<CreateByUserCommand, ResponseResult<DepartmentApproverEntity>>
{
  constructor(
    @Inject(WRITE_DEPARTMENT_APPROVER_REPOSITORY)
    private readonly _write: IWriteDepartmentApproverRepository,
    private readonly _dataMapper: DepartmentApproverDataMapper,
  ) {}

  async execute(
    query: CreateByUserCommand,
  ): Promise<ResponseResult<DepartmentApproverEntity>> {
    // await _checkColumnDuplicate(
    //   DepartmentApproverOrmEntity,
    //   'department_id',
    //   query.dto.department_id,
    //   query.manager,
    //   'errors.already_exists',
    // );
    await _checkColumnDuplicate(
      DepartmentApproverOrmEntity,
      'user_id',
      query.dto.user_id,
      query.manager,
      'errors.already_exists',
    );
    await findOneOrFail(query.manager, UserOrmEntity, {
      id: query.dto.user_id,
    });
    await findOneOrFail(query.manager, DepartmentOrmEntity, {
      id: query.dto.department_id,
    });

    const entity = this._dataMapper.toEntity(
      query.dto,
      query.dto.department_id,
    );

    return await this._write.create(entity, query.manager);
  }
}
