import { Injectable } from '@nestjs/common';
import { CurrencyDto } from '../dto/create/currency/create.dto';
import { CurrencyEntity } from '../../domain/entities/currency.entity';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { CurrencyResponse } from '../dto/response/currency.response';
import { UpdateCurrencyDto } from '../dto/create/currency/update.dto';

@Injectable()
export class CurrencyDataMapper {
  /** Mapper Dto To Entity */
  toEntity(dto: CurrencyDto | UpdateCurrencyDto): CurrencyEntity {
    const builder = CurrencyEntity.builder();

    if (dto.name) {
      builder.setName(dto.name);
    }

    if (dto.code) {
      builder.setCode(dto.code);
    }

    return builder.build();
  }

  /** Mapper Entity To Response */
  toResponse(entity: CurrencyEntity): CurrencyResponse {
    const response = new CurrencyResponse();
    response.id = entity.getId().value;
    response.code = entity.code;
    response.name = entity.name;
    response.created_at = moment
      .tz(entity.createdAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    response.updated_at = moment
      .tz(entity.updatedAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);

    return response;
  }
}
