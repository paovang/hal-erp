import { UserOrmEntity } from '@src/common/infrastructure/database/typeorm/user.orm';
import { UserEntity } from '../../domain/entities/user.entity';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { UserId } from '../../domain/value-objects/user-id.vo';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { Injectable } from '@nestjs/common';
import { RoleDataAccessMapper } from './role.mapper';
import { PermissionDataAccessMapper } from './permission.mapper';
import { UserSignatureDataAccessMapper } from './user-signature.mapper';

@Injectable()
export class UserDataAccessMapper {
  constructor(
    private readonly roleMapper: RoleDataAccessMapper,
    private readonly permissionMapper: PermissionDataAccessMapper,
    private readonly userSignature: UserSignatureDataAccessMapper,
  ) {}
  toOrmEntity(userEntity: UserEntity, method: OrmEntityMethod): UserOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);
    const id = userEntity.getId();

    const mediaOrmEntity = new UserOrmEntity();
    if (id) {
      mediaOrmEntity.id = id.value;
    }
    mediaOrmEntity.username = userEntity.username;
    mediaOrmEntity.email = userEntity.email;
    mediaOrmEntity.password = userEntity.password;
    mediaOrmEntity.tel = userEntity.tel;

    if (method === OrmEntityMethod.CREATE) {
      mediaOrmEntity.created_at = userEntity.createdAt ?? new Date(now);
    }

    mediaOrmEntity.updated_at = new Date(now);

    return mediaOrmEntity;
  }

  toEntity(ormData: UserOrmEntity): UserEntity {
    const builder = UserEntity.builder()
      .setUserId(new UserId(ormData.id))
      .setUsername(ormData.username ?? '')
      .setEmail(ormData.email ?? '') // corrected
      .setTel(ormData.tel ?? '') // corrected
      .setPassword(ormData.password ?? '')
      .setCreatedAt(ormData.created_at)
      .setUpdatedAt(ormData.updated_at)
      .setDeletedAt(ormData.deleted_at);

    if (ormData.user_signatures && ormData.user_signatures.length > 0) {
      builder.setUserSignature(
        this.userSignature.toEntity(ormData.user_signatures[0]),
      );
    }

    if (ormData.roles) {
      builder.setRoles(this.roleMapper.toEntities(ormData.roles));
    }

    if (ormData.userHasPermissions) {
      const permissions = ormData.userHasPermissions
        .map((uhp) => uhp.permission)
        .filter((p) => p != null);

      builder.setPermissions(this.permissionMapper.toEntities(permissions));
    }

    return builder.build();
  }
}
