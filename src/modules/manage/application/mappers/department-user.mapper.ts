import { Injectable } from '@nestjs/common';
import { CreateDepartmentUserDto } from '../dto/create/departmentUser/create.dto';
import { DepartmentUserEntity } from '../../domain/entities/department-user.entity';
import { DepartmentUserResponse } from '../dto/response/department-user.response';
import { UpdateDepartmentUserDto } from '../dto/create/departmentUser/update.dto';

@Injectable()
export class DepartmentUserDataMapper {
  /** Mapper Dto To Entity */
  toEntity(
    dto: Partial<CreateDepartmentUserDto | UpdateDepartmentUserDto>,
    isCreate: boolean,
    userId?: number,
  ): DepartmentUserEntity {
    const builder = DepartmentUserEntity.builder();

    if (dto.departmentId) {
      builder.setDepartmentId(dto.departmentId);
    }

    if (dto.positionId) {
      builder.setPositionId(dto.positionId);
    }

    if (dto.username) {
      builder.setUsername(dto.username);
    }

    if (dto.email) {
      builder.setEmail(dto.email);
    }

    if (dto.tel) {
      builder.setTel(dto.tel);
    }

    // Set password only if it's a create operation and password exists in dto
    if (isCreate && 'password' in dto && dto.password) {
      builder.setPassword(dto.password);
    }

    if (userId) {
      builder.setUserId(userId);
    }

    return builder.build();
  }

  /** Mapper Entity To Response */
  toResponse(entity: DepartmentUserEntity): DepartmentUserResponse {
    const response = new DepartmentUserResponse();
    response.id = entity.department?.getId().value;
    response.department_id = entity.department?.getId().value;
    response.position_id = entity.position?.getId().value;
    response.created_at = entity.createdAt?.toISOString() ?? '';
    response.updated_at = entity.updatedAt?.toISOString() ?? '';

    return response;
  }
}
