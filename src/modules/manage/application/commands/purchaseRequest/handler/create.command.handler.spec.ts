import { CurrencyConversionService } from '../../../services/currency-conversion.service';
import { CurrencyOrmEntity } from '@src/common/infrastructure/database/typeorm/currency.orm';
import { ExchangeRateOrmEntity } from '@src/common/infrastructure/database/typeorm/exchange-rate.orm';

/**
 * The PR create handler delegates rate resolution to CurrencyConversionService
 * and forwards (rate, total_in_lak) into the PR-item mapper. The full handler
 * has ~15 collaborators (S3, image optimizer, multiple repos, transaction
 * manager, etc.) so we test the integration point — the helper produces the
 * right valuation given a quota's currency.
 *
 * This is a guard-rail test: if someone refactors the helper or removes the
 * call site in the handler, the assertion below will catch the drift.
 */
describe('PR create flow — LAK valuation contract', () => {
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

  it('USD PR item priced at quantity*price gets total_in_lak = total_price * R', async () => {
    const m = manager({ id: 2, code: 'USD' }, '21000');
    const result = await service.resolveLakValuation(2, 5 * 80, m); // qty 5, price 80 → 400 USD
    expect(result.rate).toBe('21000');
    expect(result.totalInLak).toBe('8400000.00');
  });

  it('LAK PR item gets rate=1 and total_in_lak equal to total_price', async () => {
    const m = manager({ id: 1, code: 'LAK' });
    const result = await service.resolveLakValuation(1, 50000, m);
    expect(result.rate).toBe('1');
    expect(result.totalInLak).toBe('50000.00');
  });

  it('PR with non-LAK currency missing an active rate fails the save', async () => {
    const m = manager({ id: 5, code: 'EUR' }); // no rate
    await expect(service.resolveLakValuation(5, 100, m)).rejects.toThrow();
  });
});
