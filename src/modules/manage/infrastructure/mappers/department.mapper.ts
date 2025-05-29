import { DepartmentOrmEntity } from '@src/common/infrastructure/database/typeorm/department.orm';
import { DepartmentEntity } from '@src/modules/manage/domain/entities/department.entity';
import { DepartmentId } from '../../domain/value-objects/department-id.vo';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import moment from 'moment-timezone';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';

export class DepartmentDataAccessMapper {
  toOrmEntity(
    departmentEntity: DepartmentEntity,
    method: OrmEntityMethod,
  ): DepartmentOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);
    const id = departmentEntity.getId();

    const mediaOrmEntity = new DepartmentOrmEntity();
    if (id) {
      mediaOrmEntity.id = id.value;
    } else {
      mediaOrmEntity.code = departmentEntity.code;
    }
    mediaOrmEntity.name = departmentEntity.name;

    if (method === OrmEntityMethod.CREATE) {
      mediaOrmEntity.created_at = departmentEntity.createdAt ?? new Date(now);
    }

    mediaOrmEntity.updated_at = new Date(now);

    return mediaOrmEntity;
  }

  toEntity(ormData: DepartmentOrmEntity): DepartmentEntity {
    return DepartmentEntity.builder()
      .setDepartmentId(new DepartmentId(ormData.id))
      .setName(ormData.name)
      .setCode(ormData.code)
      .setCreatedAt(ormData.created_at)
      .setUpdatedAt(ormData.updated_at)
      .build();
  }
}
