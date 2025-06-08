import { ProvinceOrmEntity } from '@src/common/infrastructure/database/typeorm/province.orm';
import { ProvinceEntity } from '../../domain/entities/province.entity';
import { ProvinceId } from '../../domain/value-objects/province-id.vo';

export class ProvinceDataAccessMapper {
  toEntity(ormData: ProvinceOrmEntity): ProvinceEntity {
    return ProvinceEntity.builder()
      .setProvinceId(new ProvinceId(ormData.id))
      .setName(ormData.name ?? '')
      .setCreatedAt(ormData.created_at)
      .setUpdatedAt(ormData.updated_at)
      .build();
  }
}
