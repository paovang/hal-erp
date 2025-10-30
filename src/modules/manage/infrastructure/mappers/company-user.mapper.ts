import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import moment from 'moment-timezone';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { Injectable } from '@nestjs/common';
import { CompanyUserEntity } from '../../domain/entities/company-user.entity';
import { CompanyUserOrmEntity } from '@src/common/infrastructure/database/typeorm/company-user.orm';
import { CompanyUserId } from '../../domain/value-objects/company-user-id.vo';
import { CompanyDataAccessMapper } from './company.mapper';
import { UserDataAccessMapper } from './user.mapper';

@Injectable()
export class CompanyUserDataAccessMapper {
  constructor(
    private readonly companyMapper: CompanyDataAccessMapper, // ASSUME
    private readonly userMapper: UserDataAccessMapper,
  ) {}

  toOrmEntity(
    companyEntity: CompanyUserEntity,
    method: OrmEntityMethod,
  ): CompanyUserOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);
    const id = companyEntity.getId();

    const companyOrmEntity = new CompanyUserOrmEntity();
    if (id) {
      companyOrmEntity.id = id.value;
    }

    companyOrmEntity.company_id = companyEntity.company_id;
    companyOrmEntity.user_id = companyEntity.user_id;

    if (method === OrmEntityMethod.CREATE) {
      companyOrmEntity.created_at = companyEntity.createdAt ?? new Date(now);
    }
    companyOrmEntity.updated_at = new Date(now);

    return companyOrmEntity;
  }

  toEntity(ormData: CompanyUserOrmEntity): CompanyUserEntity {
    const builder = CompanyUserEntity.builder()
      .setCompanyUserId(new CompanyUserId(ormData.id))
      .setCompanyId(ormData.company_id ?? 0)
      .setUserId(ormData.user_id ?? 0)
      .setCreatedAt(ormData.created_at)
      .setUpdatedAt(ormData.updated_at)
      .setDeletedAt(ormData.deleted_at);

    if (ormData.user) {
      builder.setUser(this.userMapper.toEntity(ormData.user));
    }

    if (ormData.company) {
      builder.setCompany(this.companyMapper.toEntity(ormData.company));
    }

    return builder.build();
  }
}
