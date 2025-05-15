import { Department } from '@src/common/infrastructure/database/typeorm/department.orm';
import { DepartmentEntity } from '@src/modules/manage/domain/entities/department.entity';
import { DepartmentId } from '../../domain/value-objects/department-id.vo';

export class DepartmentDataAccessMapper {
  toEntity(ormData: Department): DepartmentEntity {
    return DepartmentEntity.builder()
      .setDepartmentId(new DepartmentId(ormData.id))
      .setName(ormData.name)
      .setCreatedAt(ormData.created_at)
      .setUpdatedAt(ormData.updated_at)
      .build();
  }
}
