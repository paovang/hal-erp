import { DepartmentApproverOrmEntity } from '@src/common/infrastructure/database/typeorm/department-approver.orm';
import { DepartmentApproverEntity } from '../../domain/entities/department-approver.entity';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import moment from 'moment-timezone';
import { DepartmentApproverId } from '../../domain/value-objects/department-approver-id.vo';
import { DepartmentDataAccessMapper } from './department.mapper';
import { UserDataAccessMapper } from './user.mapper';
import { Injectable } from '@nestjs/common';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';

@Injectable()
export class DepartmentApproverDataAccessMapper {
  constructor(
    private readonly departmentMapper: DepartmentDataAccessMapper,
    private readonly userMapper: UserDataAccessMapper,
  ) {}
  toOrmEntity(
    departmentApproverEntity: DepartmentApproverEntity,
    method: OrmEntityMethod,
  ): DepartmentApproverOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);
    const id = departmentApproverEntity.getId();

    const mediaOrmEntity = new DepartmentApproverOrmEntity();
    if (id) {
      mediaOrmEntity.id = id.value;
    }
    mediaOrmEntity.department_id = departmentApproverEntity.departmentId
      ? Number(departmentApproverEntity.departmentId)
      : undefined;

    mediaOrmEntity.user_id = departmentApproverEntity.userId
      ? Number(departmentApproverEntity.userId)
      : undefined;

    if (method === OrmEntityMethod.CREATE) {
      mediaOrmEntity.created_at =
        departmentApproverEntity.createdAt ?? new Date(now);
    }
    mediaOrmEntity.updated_at = new Date(now);

    return mediaOrmEntity;
  }

  toEntity(ormData: DepartmentApproverOrmEntity): DepartmentApproverEntity {
    const builder = DepartmentApproverEntity.builder()
      .setDepartmentApproverId(new DepartmentApproverId(ormData.id))
      .setDepartmentId(ormData.department_id ?? null) // corrected (null ?? '')
      .setUserId(ormData.user_id ?? null)
      .setCreatedAt(ormData.created_at)
      .setUpdatedAt(ormData.updated_at);

    if (ormData.departments) {
      builder.setDepartment(
        this.departmentMapper.toEntity(ormData.departments),
      );
    }
    if (ormData.users) {
      builder.setUser(this.userMapper.toEntity(ormData.users));
    }

    return builder.build();
  }
}
