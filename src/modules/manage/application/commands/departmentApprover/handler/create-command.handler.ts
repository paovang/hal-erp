import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { CreateCommand } from '../create.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { DepartmentApproverEntity } from '@src/modules/manage/domain/entities/department-approver.entity';
import { HttpStatus, Inject } from '@nestjs/common';
import { WRITE_DEPARTMENT_APPROVER_REPOSITORY } from '../../../constants/inject-key.const';
import { DepartmentApproverDataMapper } from '../../../mappers/department-approver.mapper';
import { IWriteDepartmentApproverRepository } from '@src/modules/manage/domain/ports/output/department-approver-repositiory.interface';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorm/user.orm';
import { DepartmentUserOrmEntity } from '@src/common/infrastructure/database/typeorm/department-user.orm';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { DepartmentApproverOrmEntity } from '@src/common/infrastructure/database/typeorm/department-approver.orm';
import { UserContextService } from '@common/infrastructure/cls/cls.service';

@CommandHandler(CreateCommand)
export class CreateCommandHandler
  implements
    IQueryHandler<CreateCommand, ResponseResult<DepartmentApproverEntity>>
{
  constructor(
    @Inject(WRITE_DEPARTMENT_APPROVER_REPOSITORY)
    private readonly _write: IWriteDepartmentApproverRepository,
    private readonly _dataMapper: DepartmentApproverDataMapper,
    private readonly _userContextService: UserContextService,
  ) {}

  async execute(
    query: CreateCommand,
  ): Promise<ResponseResult<DepartmentApproverEntity>> {
    const departmentUser =
      this._userContextService.getAuthUser()?.departmentUser;
    if (!departmentUser) {
      throw new ManageDomainException(
        'errors.not_found',
        HttpStatus.NOT_FOUND,
        {
          property: 'user',
        },
      );
    }

    const departmentId = (departmentUser as any).departments.id;
    const exists_user: number[] = [];

    let res: ResponseResult<DepartmentApproverEntity> | null = null;
    for (const userId of query.dto.user_id) {
      const user = await query.manager.findOne(DepartmentApproverOrmEntity, {
        where: { user_id: userId },
      });

      if (user) {
        exists_user.push(userId);
        continue;
      }

      await findOneOrFail(query.manager, UserOrmEntity, {
        id: userId,
      });

      const dp = await findOneOrFail(query.manager, DepartmentUserOrmEntity, {
        user_id: userId,
      });

      if (dp.department_id !== departmentId) {
        throw new ManageDomainException(
          'errors.not_found',
          HttpStatus.NOT_FOUND,
          {
            property: 'department',
          },
        );
      }

      const entity = this._dataMapper.toEntityArray(departmentId, userId);

      res = await this._write.create(entity, query.manager);
    }
    if (exists_user.length > 0) {
      throw new ManageDomainException(
        'errors.already_exists',
        HttpStatus.BAD_REQUEST,
        {
          property: `User ${exists_user.join(', ')}`,
        },
      );
    }
    return res;
  }
}
