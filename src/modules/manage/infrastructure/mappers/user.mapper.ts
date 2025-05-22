import { UserOrmEntity } from '@src/common/infrastructure/database/typeorm/user.orm';
import { UserEntity } from '../../domain/entities/user.entity';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { UserId } from '../../domain/value-objects/user-id.vo';

export class UserDataAccessMapper {
  toOrmEntity(userEntity: UserEntity): UserOrmEntity {
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
    mediaOrmEntity.created_at = userEntity.createdAt ?? new Date(now);
    mediaOrmEntity.updated_at = new Date(now);

    return mediaOrmEntity;
  }

  toEntity(ormData: UserOrmEntity): UserEntity {
    return UserEntity.builder()
      .setUserId(new UserId(ormData.id))
      .setUsername(ormData.username ?? '')
      .setEmail(ormData.email ?? '') // corrected
      .setTel(ormData.tel ?? '') // corrected
      .setPassword(ormData.password ?? '')
      .setCreatedAt(ormData.created_at)
      .setUpdatedAt(ormData.updated_at)
      .setDeletedAt(ormData.deleted_at) // this was missing too
      .build();
  }
}
