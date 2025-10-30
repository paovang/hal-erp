import { Injectable } from '@nestjs/common';
import moment from 'moment-timezone';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { CompanyUserEntity } from '../../domain/entities/company-user.entity';
import { CompanyUserResponse } from '../dto/response/company-user.response';
import { CompanyDataMapper } from './company.mapper';
import { UserDataMapper } from './user.mapper';

@Injectable()
export class CompanyUserDataMapper {
  constructor(
    private readonly companyMapper: CompanyDataMapper, // ASSUME
    private readonly userMapper: UserDataMapper,
  ) {}
  /** Mapper Dto To Entity */
  toEntity(company_id: number, user_id: number): CompanyUserEntity {
    const builder = CompanyUserEntity.builder();

    if (company_id) {
      builder.setCompanyId(company_id);
    }

    if (user_id) {
      builder.setUserId(user_id);
    }

    return builder.build();
  }

  /** Mapper Entity To Response */
  toResponse(entity: CompanyUserEntity): CompanyUserResponse {
    const response = new CompanyUserResponse();
    response.id = Number(entity.getId().value);
    response.company_id = entity.company_id;
    response.user_id = entity.user_id;
    response.created_at = moment
      .tz(entity.createdAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    response.updated_at = moment
      .tz(entity.updatedAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);

    response.company = entity.company
      ? this.companyMapper.toResponse(entity.company)
      : null;
    response.user = entity.user
      ? this.userMapper.toResponse(entity.user)
      : null;

    return response;
  }
}
