import { DepartmentUserOrmEntity } from "@src/common/infrastructure/database/typeorm/department-user.orm";
import { DepartmentUserEntity } from "../../domain/entities/department-user.entity";
import { DateFormat } from "@src/common/domain/value-objects/date-format.vo";
import { Timezone } from "@src/common/domain/value-objects/timezone.vo";
import moment from 'moment-timezone';
import { DepartmentUserId } from "../../domain/value-objects/department-user-id.vo";
import { UserEntity } from "../../domain/entities/user.entity";
import { UserId } from "../../domain/value-objects/user-id.vo";

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
        return DepartmentUserEntity.builder()
        .setDepartmentUserId(new DepartmentUserId(ormData.id))
        .setDepartmentId(ormData.department_id ?? 0)
        .setPositionId(ormData.position_id ?? 0)
        .setUserId(ormData.user_id ?? 0)
        .setCreatedAt(ormData.created_at)
        .setUpdatedAt(ormData.updated_at)
        .build();
    }
}