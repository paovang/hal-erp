import { HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { CurrencyOrmEntity } from '@src/common/infrastructure/database/typeorm/currency.orm';
import { ExchangeRateOrmEntity } from '@src/common/infrastructure/database/typeorm/exchange-rate.orm';
import { ManageDomainException } from '../../domain/exceptions/manage-domain.exception';

const LAK_CODE = 'LAK';

export interface LakValuation {
  rate: string;
  totalInLak: string;
}

@Injectable()
export class CurrencyConversionService {
  async resolveLakValuation(
    currencyId: number,
    amount: number,
    manager: EntityManager,
  ): Promise<LakValuation> {
    const currency = await manager.findOne(CurrencyOrmEntity, {
      where: { id: currencyId },
    });

    if (!currency) {
      throw new ManageDomainException(
        'errors.not_found',
        HttpStatus.NOT_FOUND,
        { property: `currency ${currencyId}` },
      );
    }

    if (currency.code === LAK_CODE) {
      return { rate: '1', totalInLak: this.toLakString(Number(amount)) };
    }

    const exchangeRate = await manager.findOne(ExchangeRateOrmEntity, {
      where: {
        from_currency_id: currencyId,
        to_currency: { code: LAK_CODE },
        is_active: true,
      },
      relations: ['to_currency'],
    });

    if (!exchangeRate) {
      throw new ManageDomainException(
        'errors.exchange_rate_not_found',
        HttpStatus.BAD_REQUEST,
        { property: currency.code },
      );
    }

    const rate = Number(exchangeRate.rate);
    return {
      rate: String(rate),
      totalInLak: this.toLakString(Number(amount) * rate),
    };
  }

  toLakString(value: number): string {
    return (Math.round((value + Number.EPSILON) * 100) / 100).toFixed(2);
  }
}
