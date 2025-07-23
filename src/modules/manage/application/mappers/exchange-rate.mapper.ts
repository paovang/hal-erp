import { Injectable } from '@nestjs/common';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { CreateExchangeRateType } from '../dto/create/exchange-rates/create.dto';
import { UpdateExchangeRateDto } from '../dto/create/exchange-rates/update.dto';
import { ExchangeRateEntity } from '../../domain/entities/exchange-rate.entity';
import { ExchangeRateResponse } from '../dto/response/exchange-rate.response';
import { CurrencyDataMapper } from './currency.mapper';

@Injectable()
export class ExchangeRateDataMapper {
  /** Mapper Dto To Entity */
  constructor(private readonly currencyDataMapper: CurrencyDataMapper) {}
  toEntity(
    dto: CreateExchangeRateType | UpdateExchangeRateDto,
  ): ExchangeRateEntity {
    const builder = ExchangeRateEntity.builder();

    if (dto.from_currency_id) {
      builder.setFromCurrencyId(dto.from_currency_id);
    }

    if (dto.to_currency_id) {
      builder.setToCurrencyId(dto.to_currency_id);
    }
    if (dto.rate) {
      builder.setRate(dto.rate);
    }
    if (dto.is_active) {
      builder.setIsActive(dto.is_active);
    }

    return builder.build();
  }

  /** Mapper Entity To Response */
  toResponse(entity: ExchangeRateEntity): ExchangeRateResponse {
    const response = new ExchangeRateResponse();
    response.id = entity.getId().value;
    response.from_currency_id = entity.from_currency_id;
    response.to_currency_id = entity.to_currency_id;
    response.rate = entity.rate;
    response.is_active = entity.is_active;
    response.created_at = moment
      .tz(entity.createdAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    response.updated_at = moment
      .tz(entity.updatedAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    response.from_currency = entity.from_currency
      ? this.currencyDataMapper.toResponse(entity.from_currency)
      : null;
    response.to_currency = entity.to_currency
      ? this.currencyDataMapper.toResponse(entity.to_currency)
      : null;
    return response;
  }
}
