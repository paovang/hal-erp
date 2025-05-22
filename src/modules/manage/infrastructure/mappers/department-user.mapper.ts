import { DepartmentUserOrmEntity } from "@src/common/infrastructure/database/typeorm/department-user.orm";
import { DepartmentUserEntity } from "../../domain/entities/department-user.entity";
import { DateFormat } from "@src/common/domain/value-objects/date-format.vo";
import { Timezone } from "@src/common/domain/value-objects/timezone.vo";
import moment from 'moment-timezone';
import { DepartmentUserId } from "../../domain/value-objects/department-user-id.vo";
import { UserEntity } from "../../domain/entities/user.entity";
import { UserId } from "../../domain/value-objects/user-id.vo";
import { DepartmentId } from "../../domain/value-objects/department-id.vo";
import { DepartmentEntity } from "../../domain/entities/department.entity";

export class DepartmentUserDataAccessMapper {
  toOrmEntity(departmentUserEntity: DepartmentUserEntity): DepartmentUserOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);
    const id = departmentUserEntity.getId();

    const mediaOrmEntity = new DepartmentUserOrmEntity();
    if (id) {
      mediaOrmEntity.id = id.value;
    }

    mediaOrmEntity.department_id = departmentUserEntity.departmentId;
    mediaOrmEntity.position_id = departmentUserEntity.positionId;
    mediaOrmEntity.user_id = departmentUserEntity.userId;
    mediaOrmEntity.created_at = departmentUserEntity.createdAt ?? new Date(now);
    mediaOrmEntity.updated_at = new Date(now);

    return mediaOrmEntity;
  }

    toEntity(ormData: DepartmentUserOrmEntity): DepartmentUserEntity {
      // const users = (ormData.users || []).map(u =>
      //   UserEntity.builder()
      //       .setUserId(new UserId(u.id))
      //       .setUsername(u.username ?? '')
      //       .setEmail(u.email ?? '')
      //       .setTel(u.tel ?? '')
      //       .setCreatedAt(u.created_at)
      //       .setUpdatedAt(u.updated_at)
      //       .setDeletedAt(u.deleted_at)
      //       .build(),
      //   );

      const department = DepartmentEntity.builder()
      .setDepartmentId(new DepartmentId(ormData.departments.id))
      .setName(ormData.departments.name)
      .setCreatedAt(ormData.departments.created_at)
      .setUpdatedAt(ormData.departments.updated_at)
      .build();

      return DepartmentUserEntity.builder()
      .setDepartmentUserId(new DepartmentUserId(ormData.id))
      .setDepartmentId(ormData.department_id ?? 0)
      .setPositionId(ormData.position_id ?? 0)
      .setUserId(ormData.user_id ?? 0)
      .setCreatedAt(ormData.created_at)
      .setUpdatedAt(ormData.updated_at)
      .setDepartment(department)
      // .setUserId(users)
      .build();
    }
}