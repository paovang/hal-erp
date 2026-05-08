import { CurrencyConversionService } from '../../../services/currency-conversion.service';
import { CurrencyOrmEntity } from '@src/common/infrastructure/database/typeorm/currency.orm';
import { ExchangeRateOrmEntity } from '@src/common/infrastructure/database/typeorm/exchange-rate.orm';

/**
 * The PO create handler resolves rate twice per item (once for `total`, once
 * for `vat`) and forwards both LAK figures into the mapper. We assert the
 * valuations match the migration's backfill formula:
 *
 *   total_in_lak = ROUND(total * rate, 2)
 *   vat_in_lak   = ROUND(vat   * rate, 2)
 */
describe('PO create flow — LAK valuation contract', () => {
  const service = new CurrencyConversionService();

  function manager(currency: { id: number; code: string }, rate?: string) {
    return {
      findOne: jest.fn(async (entity: any, opts: any) => {
        if (entity === CurrencyOrmEntity)
          return opts.where?.id === currency.id ? currency : null;
        if (entity === ExchangeRateOrmEntity) return rate ? { rate } : null;
        return null;
      }),
    } as any;
  }

  it('USD PO item with VAT produces matching total_in_lak and vat_in_lak', async () => {
    const m = manager({ id: 2, code: 'USD' }, '21000');
    const totalLak = await service.resolveLakValuation(2, 200, m);
    const vatLak = await service.resolveLakValuation(2, 20, m);
    expect(totalLak.rate).toBe('21000');
    expect(vatLak.rate).toBe('21000');
    expect(totalLak.totalInLak).toBe('4200000.00');
    expect(vatLak.totalInLak).toBe('420000.00');
  });

  it('zero-VAT PO item gets vat_in_lak = "0.00"', async () => {
    const m = manager({ id: 2, code: 'USD' }, '21000');
    const vatLak = await service.resolveLakValuation(2, 0, m);
    expect(vatLak.totalInLak).toBe('0.00');
  });

  it('LAK PO item gets rate=1 and LAK fields equal native fields', async () => {
    const m = manager({ id: 1, code: 'LAK' });
    const totalLak = await service.resolveLakValuation(1, 12345.6, m);
    const vatLak = await service.resolveLakValuation(1, 1234.56, m);
    expect(totalLak.rate).toBe('1');
    expect(totalLak.totalInLak).toBe('12345.60');
    expect(vatLak.totalInLak).toBe('1234.56');
  });
});
