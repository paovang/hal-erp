import { UserSignatureOrmEntity } from '@src/common/infrastructure/database/typeorm/user-signature.orm';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { UserSignatureEntity } from '../../domain/entities/user-signature.entity';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { UserSignatureId } from '../../domain/value-objects/user-signature-id.vo';

export class UserSignatureDataAccessMapper {
  toOrmEntity(
    userSignatureEntity: UserSignatureEntity,
    method: OrmEntityMethod,
  ): UserSignatureOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);
    const id = userSignatureEntity.getId();

    const mediaOrmEntity = new UserSignatureOrmEntity();
    if (id) {
      mediaOrmEntity.id = id.value;
    }

    mediaOrmEntity.user_id = userSignatureEntity.userId;
    mediaOrmEntity.signature_file = userSignatureEntity.signature ?? undefined;
    if (method === OrmEntityMethod.CREATE) {
      mediaOrmEntity.created_at =
        userSignatureEntity.createdAt ?? new Date(now);
    }
    mediaOrmEntity.updated_at = new Date(now);

    return mediaOrmEntity;
  }

  toEntity(ormData: UserSignatureOrmEntity): UserSignatureEntity {
    return UserSignatureEntity.builder()
      .setUserSignatureId(new UserSignatureId(ormData.id))
      .setUserId(ormData.user_id ?? 0)
      .setSignature(ormData.signature_file)
      .setCreatedAt(ormData.created_at)
      .setUpdatedAt(ormData.updated_at)
      .build();
  }
}
