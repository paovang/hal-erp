import { CurrencyConversionService } from './currency-conversion.service';
import { CurrencyOrmEntity } from '@src/common/infrastructure/database/typeorm/currency.orm';
import { ExchangeRateOrmEntity } from '@src/common/infrastructure/database/typeorm/exchange-rate.orm';
import { ManageDomainException } from '../../domain/exceptions/manage-domain.exception';

type FindOneArgs = { where?: any; relations?: any };

function makeManager(
  currencies: Record<number, { id: number; code: string }>,
  rates: Array<{ from_currency_id: number; to_code: string; rate: string }>,
) {
  return {
    findOne: jest.fn(async (entity: any, opts: FindOneArgs) => {
      if (entity === CurrencyOrmEntity) {
        const id = opts.where?.id;
        return currencies[id] ?? null;
      }
      if (entity === ExchangeRateOrmEntity) {
        const fromId = opts.where?.from_currency_id;
        const toCode = opts.where?.to_currency?.code;
        const isActive = opts.where?.is_active;
        const match = rates.find(
          (r) =>
            r.from_currency_id === fromId &&
            r.to_code === toCode &&
            isActive === true,
        );
        return match ? { rate: match.rate } : null;
      }
      return null;
    }),
  } as any;
}

describe('CurrencyConversionService', () => {
  const service = new CurrencyConversionService();

  it('returns rate=1 and totalInLak=amount when currency is LAK', async () => {
    const manager = makeManager({ 1: { id: 1, code: 'LAK' } }, []);
    const result = await service.resolveLakValuation(1, 12345.6789, manager);
    expect(result.rate).toBe('1');
    expect(result.totalInLak).toBe('12345.68');
    expect(manager.findOne).toHaveBeenCalledTimes(1);
  });

  it('uses active exchange rate when currency is non-LAK', async () => {
    const manager = makeManager({ 2: { id: 2, code: 'USD' } }, [
      { from_currency_id: 2, to_code: 'LAK', rate: '21000.00000000' },
    ]);
    const result = await service.resolveLakValuation(2, 100, manager);
    expect(result.rate).toBe('21000');
    expect(result.totalInLak).toBe('2100000.00');
  });

  it('rounds totalInLak to 2 fractional digits', async () => {
    const manager = makeManager({ 3: { id: 3, code: 'THB' } }, [
      { from_currency_id: 3, to_code: 'LAK', rate: '600.555' },
    ]);
    const result = await service.resolveLakValuation(3, 1.005, manager);
    // 1.005 * 600.555 = 603.557775 → 603.56
    expect(result.totalInLak).toBe('603.56');
  });

  it('returns "0.00" when amount is 0', async () => {
    const manager = makeManager({ 2: { id: 2, code: 'USD' } }, [
      { from_currency_id: 2, to_code: 'LAK', rate: '21000' },
    ]);
    const result = await service.resolveLakValuation(2, 0, manager);
    expect(result.totalInLak).toBe('0.00');
  });

  it('throws when currency does not exist', async () => {
    const manager = makeManager({}, []);
    await expect(
      service.resolveLakValuation(99, 100, manager),
    ).rejects.toBeInstanceOf(ManageDomainException);
  });

  it('throws when no active exchange rate is configured for non-LAK currency', async () => {
    const manager = makeManager({ 4: { id: 4, code: 'CNY' } }, []);
    await expect(
      service.resolveLakValuation(4, 100, manager),
    ).rejects.toBeInstanceOf(ManageDomainException);
  });

  describe('toLakString', () => {
    it.each([
      [0, '0.00'],
      [1, '1.00'],
      [1.005, '1.01'],
      [1.004, '1.00'],
      [123456789.12345, '123456789.12'],
    ])('rounds %p to %p', (input, expected) => {
      expect(service.toLakString(input)).toBe(expected);
    });
  });
});
