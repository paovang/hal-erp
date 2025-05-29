import { VendorOrmEntity } from '@src/common/infrastructure/database/typeorm/vendor.orm';
import { VendorEntity } from '../../domain/entities/vendor.entity';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import moment from 'moment-timezone';
import { VendorId } from '../../domain/value-objects/vendor-id.vo';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';

export class VendorDataAccessMapper {
  toOrmEntity(
    vendorEntity: VendorEntity,
    method: OrmEntityMethod,
  ): VendorOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);
    const id = vendorEntity.getId();

    const mediaOrmEntity = new VendorOrmEntity();
    if (id) {
      mediaOrmEntity.id = id.value;
    }

    mediaOrmEntity.contact_info = vendorEntity.contactInfo;
    mediaOrmEntity.name = vendorEntity.name;

    if (method === OrmEntityMethod.CREATE) {
      mediaOrmEntity.created_at = vendorEntity.createdAt ?? new Date(now);
    }

    mediaOrmEntity.updated_at = new Date(now);

    return mediaOrmEntity;
  }

  toEntity(ormData: VendorOrmEntity): VendorEntity {
    return VendorEntity.builder()
      .setVendorId(new VendorId(ormData.id))
      .setName(ormData.name)
      .setContactInfo(ormData.contact_info)
      .setCreatedAt(ormData.created_at)
      .setUpdatedAt(ormData.updated_at)
      .build();
  }
}
