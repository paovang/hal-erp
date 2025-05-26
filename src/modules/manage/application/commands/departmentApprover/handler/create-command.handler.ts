import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { CreateCommand } from '../create.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { DepartmentApproverEntity } from '@src/modules/manage/domain/entities/department-approver.entity';
import { Inject } from '@nestjs/common';
import { WRITE_DEPARTMENT_APPROVER_REPOSITORY } from '../../../constants/inject-key.const';
import { DepartmentApproverDataMapper } from '../../../mappers/department-approver.mapper';
import { IWriteDepartmentApproverRepository } from '@src/modules/manage/domain/ports/output/department-approver-repositiory.interface';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorm/user.orm';
import { DepartmentUserOrmEntity } from '@src/common/infrastructure/database/typeorm/department-user.orm';

@CommandHandler(CreateCommand)
export class CreateCommandHandler
  implements
    IQueryHandler<CreateCommand, ResponseResult<DepartmentApproverEntity>>
{
  constructor(
    @Inject(WRITE_DEPARTMENT_APPROVER_REPOSITORY)
    private readonly _write: IWriteDepartmentApproverRepository,
    private readonly _dataMapper: DepartmentApproverDataMapper,
  ) {}

  async execute(
    query: CreateCommand,
  ): Promise<ResponseResult<DepartmentApproverEntity>> {
    await findOneOrFail(query.manager, UserOrmEntity, {
      id: query.dto.user_id,
    });

    await findOneOrFail(query.manager, DepartmentUserOrmEntity, {
      user_id: query.dto.user_id,
    });

    const entity = this._dataMapper.toEntity(query.dto);

    return await this._write.create(entity, query.manager);
  }
}
