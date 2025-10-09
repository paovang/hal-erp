import { DepartmentUserOrmEntity } from '@src/common/infrastructure/database/typeorm/department-user.orm';
import { DepartmentUserEntity } from '../../domain/entities/department-user.entity';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import moment from 'moment-timezone';
import { DepartmentUserId } from '../../domain/value-objects/department-user-id.vo';
import { Injectable } from '@nestjs/common';
import { DepartmentDataAccessMapper } from './department.mapper';
import { UserDataAccessMapper } from './user.mapper';
import { PositionDataAccessMapper } from './position.mapper';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { UserTypeDataAccessMapper } from './user-type.mapper';

@Injectable()
export class DepartmentUserDataAccessMapper {
  constructor(
    private readonly departmentMapper: DepartmentDataAccessMapper,
    private readonly userMapper: UserDataAccessMapper,
    private readonly userTypeMapper: UserTypeDataAccessMapper,
    private readonly positionMapper: PositionDataAccessMapper,
  ) {}

  toOrmEntity(
    departmentUserEntity: DepartmentUserEntity,
    method: OrmEntityMethod,
  ): DepartmentUserOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);
    const id = departmentUserEntity.getId();
    const mediaOrmEntity = new DepartmentUserOrmEntity();
    if (id) {
      mediaOrmEntity.id = id.value;
    }

    mediaOrmEntity.department_id = departmentUserEntity.departmentId;
    mediaOrmEntity.position_id = departmentUserEntity.positionId;
    mediaOrmEntity.user_id = departmentUserEntity.userId;
    mediaOrmEntity.line_manager_id =
      departmentUserEntity.line_manager_id ?? null;
    // mediaOrmEntity.user_id =
    //   departmentUserEntity.user_type?.map((type) => type.user_id) ?? 0;
    if (method === OrmEntityMethod.CREATE) {
      mediaOrmEntity.created_at =
        departmentUserEntity.createdAt ?? new Date(now);
    }
    mediaOrmEntity.updated_at = new Date(now);

    return mediaOrmEntity;
  }

  toEntity(ormData: DepartmentUserOrmEntity): DepartmentUserEntity {
    const builder = DepartmentUserEntity.builder()
      .setDepartmentUserId(new DepartmentUserId(ormData.id))
      .setDepartmentId(ormData.department_id ?? 0)
      .setUserId(ormData.user_id ?? 0)
      .setPositionId(ormData.position_id ?? 0)
      .setLineManagerId(ormData.line_manager_id ?? 0)
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
    if (ormData.positions) {
      builder.setPosition(this.positionMapper.toEntity(ormData.positions));
    }
    if (ormData.line_manager) {
      builder.setLineManager(this.userMapper.toEntity(ormData.line_manager));
    }
    if (ormData?.users?.user_types) {
      builder.setUserType(
        ormData?.users?.user_types.map((type) =>
          this.userTypeMapper.toEntity(type),
        ),
      );
    }

    return builder.build();
  }
}
