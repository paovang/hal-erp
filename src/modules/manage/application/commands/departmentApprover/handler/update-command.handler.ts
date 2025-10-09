import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { UpdateCommand } from '../update.command';
import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { DepartmentApproverEntity } from '@src/modules/manage/domain/entities/department-approver.entity';
import { WRITE_DEPARTMENT_APPROVER_REPOSITORY } from '../../../constants/inject-key.const';
import { HttpStatus, Inject } from '@nestjs/common';
import { IWriteDepartmentApproverRepository } from '@src/modules/manage/domain/ports/output/department-approver-repositiory.interface';
import { DepartmentApproverDataMapper } from '../../../mappers/department-approver.mapper';
import { DepartmentApproverId } from '../../../../domain/value-objects/department-approver-id.vo';
import { DepartmentApproverOrmEntity } from '@src/common/infrastructure/database/typeorm/department-approver.orm';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorm/user.orm';
import { DepartmentUserOrmEntity } from '@common/infrastructure/database/typeorm/department-user.orm';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { _checkColumnDuplicate } from '@common/utils/check-column-duplicate-orm.util';
import { UserContextService } from '@common/infrastructure/cls/cls.service';

@CommandHandler(UpdateCommand)
export class UpdateCommandHandler
  implements
    IQueryHandler<UpdateCommand, ResponseResult<DepartmentApproverEntity>>
{
  constructor(
    @Inject(WRITE_DEPARTMENT_APPROVER_REPOSITORY)
    private readonly _write: IWriteDepartmentApproverRepository,
    private readonly _dataMapper: DepartmentApproverDataMapper,
    private readonly _userContextService: UserContextService,
  ) {}

  async execute(
    query: UpdateCommand,
  ): Promise<ResponseResult<DepartmentApproverEntity>> {
    await _checkColumnDuplicate(
      DepartmentApproverOrmEntity,
      'user_id',
      query.dto.user_id,
      query.manager,
      'errors.already_exists',
      query.id,
    );

    const departmentUser =
      this._userContextService.getAuthUser()?.departmentUser;
    if (!departmentUser) {
      throw new ManageDomainException('error.not_found', HttpStatus.NOT_FOUND, {
        property: 'user',
      });
    }

    // const departmentId = (departmentUser as any).department_id;
    const departmentId = (departmentUser as any).departments.id;

    await findOneOrFail(query.manager, UserOrmEntity, {
      id: query.dto.user_id,
    });

    const dp = await findOneOrFail(query.manager, DepartmentUserOrmEntity, {
      user_id: query.dto.user_id,
    });

    if (dp.department_id !== departmentId) {
      throw new ManageDomainException('error.not_found', HttpStatus.NOT_FOUND, {
        property: 'department',
      });
    }

    const entity = this._dataMapper.toEntity(query.dto, departmentId);
    await entity.initializeUpdateSetId(new DepartmentApproverId(query.id));
    await entity.validateExistingIdForUpdate();

    /** Check Exits Department Id */
    await findOneOrFail(query.manager, DepartmentApproverOrmEntity, {
      id: entity.getId().value,
    });

    return await this._write.update(entity, query.manager);
  }
}
