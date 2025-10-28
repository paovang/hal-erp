import { Injectable } from '@nestjs/common';
import { CompanyEntity } from '@src/modules/manage/domain/entities/company.entity';
import { CompanyResponse } from '@src/modules/manage/application/dto/response/company.response';
import moment from 'moment-timezone';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { CreateCompanyDto } from '@src/modules/manage/application/dto/create/company/create.dto';
import { UpdateCompanyDto } from '@src/modules/manage/application/dto/create/company/update.dto';

@Injectable()
export class CompanyDataMapper {
  /** Mapper Dto To Entity */
  toEntity(dto: CreateCompanyDto | UpdateCompanyDto): CompanyEntity {
    const builder = CompanyEntity.builder();

    if (dto.name) {
      builder.setName(dto.name);
    }

    if (dto.logo) {
      builder.setLogo(dto.logo);
    }

    if (dto.tel) {
      builder.setTel(dto.tel);
    }

    if (dto.email) {
      builder.setEmail(dto.email);
    }

    if (dto.address) {
      builder.setAddress(dto.address);
    }

    return builder.build();
  }

  /** Mapper Entity To Response */
  toResponse(entity: CompanyEntity): CompanyResponse {
    const logo_url = entity?.logo
      ? `${process.env.AWS_CLOUDFRONT_DISTRIBUTION_DOMAIN_NAME}/${entity.logo}`
      : null;
    const response = new CompanyResponse();
    response.id = Number(entity.getId().value);
    response.name = entity.name;
    response.logo = entity.logo;
    response.logo_url = logo_url;
    response.tel = entity.tel;
    response.email = entity.email;
    response.address = entity.address;
    response.created_at = moment
      .tz(entity.createdAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    response.updated_at = moment
      .tz(entity.updatedAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);

    return response;
  }
}
