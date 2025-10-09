import { Injectable } from '@nestjs/common';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { CreateBankDto } from '../dto/create/banks/create.dto';
import { UpdateBankDto } from '../dto/create/banks/update.dto';
import { BankEntity } from '../../domain/entities/bank.entity';
import { BankResponse } from '../dto/response/bank.response';

@Injectable()
export class BankDataMapper {
  /** Mapper Dto To Entity */
  toEntity(dto: CreateBankDto | UpdateBankDto): BankEntity {
    const builder = BankEntity.builder();

    if (dto.name) {
      builder.setName(dto.name);
    }

    if (dto.short_name) {
      builder.setShortName(dto.short_name);
    }
    if (dto.logo) {
      builder.setLogo(dto.logo);
    }

    return builder.build();
  }

  /** Mapper Entity To Response */
  toResponse(entity: BankEntity): BankResponse {
    const response = new BankResponse();
    const file = entity?.logo
      ? `${process.env.AWS_CLOUDFRONT_DISTRIBUTION_DOMAIN_NAME}/${entity.logo}`
      : '';
    response.id = entity.getId().value;
    response.short_name = entity.short_name;
    response.name = entity.name;
    response.logo = entity.logo;
    response.logoUrl = file;
    response.created_at = moment
      .tz(entity.createdAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    response.updated_at = moment
      .tz(entity.updatedAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);

    return response;
  }
}
