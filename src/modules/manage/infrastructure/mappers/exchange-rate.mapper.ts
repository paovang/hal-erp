import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { Injectable } from '@nestjs/common';
import { ExchangeRateOrmEntity } from '@src/common/infrastructure/database/typeorm/exchange-rate.orm';
import { ExchangeRateEntity } from '../../domain/entities/exchange-rate.entity';
import { ExchangeRateId } from '../../domain/value-objects/exchange-rate-id.vo';
import { CurrencyDataAccessMapper } from './currency.mapper';

@Injectable()
export class ExchangeRateDataAccessMapper {
  constructor(private readonly _currencyMapper: CurrencyDataAccessMapper) {}

  toOrmEntity(
    exchangeRateEntity: ExchangeRateEntity,
    method: OrmEntityMethod,
  ): ExchangeRateOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);
    const id = exchangeRateEntity.getId();

    const exchangeRateOrmEntity = new ExchangeRateOrmEntity();

    if (id) {
      exchangeRateOrmEntity.id = Number(id.value);
    }

    exchangeRateOrmEntity.from_currency_id =
      exchangeRateEntity.from_currency_id;
    exchangeRateOrmEntity.to_currency_id = exchangeRateEntity.to_currency_id;
    exchangeRateOrmEntity.rate = Number(exchangeRateEntity.rate);
    exchangeRateOrmEntity.is_active = exchangeRateEntity.is_active;

    if (method === OrmEntityMethod.CREATE) {
      exchangeRateOrmEntity.created_at =
        exchangeRateEntity.createdAt ?? new Date(now);
    }
    exchangeRateOrmEntity.updated_at = new Date(now);

    return exchangeRateOrmEntity;
  }

  toEntity(ormData: ExchangeRateOrmEntity): ExchangeRateEntity {
    const build = ExchangeRateEntity.builder()
      .setExchangeRateId(new ExchangeRateId(ormData.id))
      .setFromCurrencyId(ormData.from_currency_id ?? 0)
      .setToCurrencyId(ormData.to_currency_id ?? 0) // Fixed: should be number, not string
      .setRate(ormData.rate ?? '0')
      .setIsActive(ormData.is_active ?? false) // Added missing is_active mapping
      .setCreatedAt(ormData.created_at)
      .setUpdatedAt(ormData.updated_at);
    // Map from_currency relation
    if (ormData.from_currency) {
      build.setFromCurrency(
        this._currencyMapper.toEntity(ormData.from_currency),
      );
    }

    // Map to_currency relation - FIXED: was incorrectly calling setFromCurrency
    if (ormData.to_currency) {
      build.setToCurrency(this._currencyMapper.toEntity(ormData.to_currency));
    }

    return build.build();
  }
}
