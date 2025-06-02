import { Injectable } from '@nestjs/common';
import { CreateDepartmentUserDto } from '../dto/create/departmentUser/create.dto';
import { DepartmentUserEntity } from '../../domain/entities/department-user.entity';
import { DepartmentUserResponse } from '../dto/response/department-user.response';
import { UpdateDepartmentUserDto } from '../dto/create/departmentUser/update.dto';
import { DepartmentDataMapper } from './department.mapper';
import { PositionDataMapper } from './position.mapper';
import { UserDataMapper } from './user.mapper';

@Injectable()
export class DepartmentUserDataMapper {
  constructor(
    private readonly departmentDataMapper: DepartmentDataMapper,
    private readonly positionDataMapper: PositionDataMapper,
    private readonly userDataMapper: UserDataMapper,
  ) {}

  /** Mapper Dto To Entity */
  toEntity(
    dto: Partial<CreateDepartmentUserDto | UpdateDepartmentUserDto>,
    isCreate: boolean,
    userId?: number,
    s3ImageResponse: { fileKey: string } | null = null,
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

    if (s3ImageResponse) {
      builder.setSignatureFile(s3ImageResponse.fileKey);
    }

    return builder.build();
  }

  /** Mapper Entity To Response */
  toResponse(entity: DepartmentUserEntity): DepartmentUserResponse {
    const file = `${process.env.AWS_CLOUDFRONT_DISTRIBUTION_DOMAIN_NAME}/${entity.signature_file}`;
    const response = new DepartmentUserResponse();
    response.id = entity.getId().value;
    response.department_id = entity.department?.getId().value;
    response.position_id = entity.position?.getId().value;
    response.signature_file = entity.signature_file ?? null;
    response.signature_file_url = entity.signature_file ? file : null;
    response.created_at = entity.createdAt?.toISOString() ?? '';
    response.updated_at = entity.updatedAt?.toISOString() ?? '';

    response.department = entity.department
      ? this.departmentDataMapper.toResponse(entity.department)
      : null;

    response.position = entity.position
      ? this.positionDataMapper.toResponse(entity.position)
      : null;

    response.user = entity.user
      ? this.userDataMapper.toResponse(entity.user)
      : null;

    return response;
  }
}
