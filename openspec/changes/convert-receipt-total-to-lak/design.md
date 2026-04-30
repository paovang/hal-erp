## Context

Receipt items are stored with two currencies and a stored exchange rate (see [src/common/infrastructure/database/typeorm/receipt.item.orm.ts](src/common/infrastructure/database/typeorm/receipt.item.orm.ts)):
- `currency_id` — the *product/source* currency.
- `payment_currency_id` — the currency the payment is denominated in.
- `payment_total`, `vat` — stored in the **payment currency**.
- `exchange_rate` — historic rate captured at receipt time (currently informational).

The infrastructure mapper [src/modules/manage/infrastructure/mappers/receipt.mapper.ts](src/modules/manage/infrastructure/mappers/receipt.mapper.ts) builds a per-request rate map by querying `ExchangeRateOrmEntity` for rows where `to_currency.code = 'LAK'`, keyed by `from_currency.id`. In `toEntity` (lines 75-103) it sums `payment_total * rate` and `vat * rate` to produce LAK totals — but the rate lookup uses `item.currency.id` (product currency), while `payment_total` is denominated in `payment_currency_id`. When those two currencies differ, the conversion multiplies a payment-currency amount by a product-currency rate and the resulting "LAK" totals are wrong. Additionally, `calculateCurrencyTotalsFromItems` (lines 172-208) overwrites entries by `currencyId` on each loop iteration without aggregating, so multi-item receipts under the same payment currency display only the last item's data.

The application mapper [src/modules/manage/application/mappers/receipt.mapper.ts](src/modules/manage/application/mappers/receipt.mapper.ts) `toResponse` simply forwards the entity fields, so the mismatch surfaces directly in `GET /api/receipts` and `GET /api/receipts/:id`.

Stakeholders: finance team consuming receipt totals for reporting; web/mobile clients rendering receipt list/detail.

## Goals / Non-Goals

**Goals:**
- Top-level `total`, `sub_total`, `vat` on every receipt response are accurate **LAK** values.
- Each `currency_totals[]` entry reports `total`/`vat`/`amount` in **LAK**, while preserving the original currency's `id`/`code`/`name` for display.
- Aggregate `currency_totals` correctly when multiple items share a payment currency (sum, do not overwrite).
- Use the **payment currency** for rate lookup, since `payment_total` and `vat` are stored in the payment currency.
- Fail loudly with a `BadRequestException` (or domain-specific exception) when the required `<payment_currency> → LAK` rate is missing — never silently emit unconverted numbers.

**Non-Goals:**
- Changing DB schema, migrations, or the stored `exchange_rate` column on receipt items.
- Historic rate lookup keyed by receipt date (current behaviour uses the latest active `to_currency = LAK` row; out of scope).
- Converting purchase-order or purchase-request totals (separate change).
- Redesigning the response DTO shape — only the values change, not the field names.

## Decisions

### 1. Rate lookup key: `payment_currency_id`, not `currency_id`
Because `payment_total` and `vat` are stored in the payment currency, the exchange rate must be `payment_currency → LAK`. The current code uses `item.currency.id` (product currency), which is the root cause of the wrong totals.

**Alternative considered:** keep using `item.currency_id` and additionally divide by stored `exchange_rate` to first normalise to product currency, then apply product→LAK rate. Rejected — extra arithmetic, more error surface, and ignores that `payment_total` is *already* the canonical billable amount.

### 2. Conversion stays in the infrastructure mapper
The conversion is a read-side concern triggered by the persistence layer joining `ExchangeRateOrmEntity`. Keeping it in `ReceiptDataAccessMapper` reuses the already-injected `Repository<ExchangeRateOrmEntity>` and avoids polluting the domain entity with an external dependency.

**Alternative considered:** introduce a domain service `CurrencyConverter` and inject it into command/query handlers. Rejected for this change — would touch many call sites; the current mapper-local approach is the smallest fix that addresses the bug. Can be revisited if other modules need the same conversion.

### 3. Per-request rate map, not per-item DB call
Continue building a single `Map<currencyId, rate>` once per `toEntity` invocation. For list endpoints that map N receipts, the existing pattern issues N rate-table reads (one per receipt) — acceptable for now since the rate table is small. A single shared cache across the list call is a follow-up optimisation, not a correctness fix.

### 4. `currency_totals` aggregation
Replace the `currencyMap.set(...)` overwrite with a `get/merge/set` pattern: if the entry exists, sum `total`/`vat`/`amount`; otherwise insert. This matches the field's intent — *totals grouped by payment currency* — and aligns with how the front-end renders the breakdown.

### 5. Error contract on missing rate
Throw `BadRequestException` with a message identifying the missing pair, e.g. `Exchange rate from currency <id/code> to LAK is not configured.` This matches the existing pattern in the file and surfaces a 400 to the client. Receipts where every item already has a payment currency of LAK skip the lookup (rate of 1).

**Alternative considered:** fall back to rate = 1 on missing config. Rejected — silently mis-reporting LAK totals is worse than a clear failure; finance correctness > availability for this endpoint.

### 6. Swagger/DTO documentation
Update `@ApiProperty` descriptions on `total`, `sub_total`, `vat`, and `currency_totals[].total/vat/amount` in [receipt.response.ts](src/modules/manage/application/dto/response/receipt.response.ts) to state the unit is LAK. No field rename — keeps the change non-breaking at the JSON-shape level.

## Risks / Trade-offs

- **Risk:** Existing front-end code may have already worked around the bug by re-converting using `currency_totals[].code`. → **Mitigation:** Coordinate release with the front-end team; ship the API change behind a deploy window where the FE update lands first or simultaneously. Add a release note flagged as **BREAKING** for downstream consumers.
- **Risk:** Production data may have receipt items whose payment currency lacks an active `→ LAK` rate. After this change, `GET /api/receipts` would 400 for those. → **Mitigation:** Before deploy, run a one-off audit query: `SELECT DISTINCT payment_currency_id FROM receipt_items` and verify each has an active row in `exchange_rates` to LAK. Seed missing rates if any.
- **Risk:** N+1-ish rate lookups remain (one query per receipt during list). → **Mitigation:** Acceptable in the short term; flag as a follow-up optimisation. A future change can hoist the rate map into the repository or a request-scoped cache.
- **Trade-off:** No historic rate lookup by `receipt_date` — clients see "current" LAK valuations even for old receipts. The stored `receipt_items.exchange_rate` is unused by the read path. Acceptable for this fix; revisit if finance requires historical valuation.
- **Trade-off:** Conversion logic duplicated between `toEntity` (sub_total/vat/total) and `calculateCurrencyTotalsFromItems` (per-currency aggregation). Both must use the same lookup key. Mitigation: extract a small private helper `convertItemToLak(item, rateMap)` returning `{total, vat}` and call it from both paths.

## Migration Plan

1. Pre-deploy: audit `payment_currency_id` distinct values vs. active `exchange_rates` rows.
2. Deploy API change.
3. Smoke-test `GET /api/receipts` and `GET /api/receipts/:id` against staging records covering: all-LAK receipts, single-foreign-currency receipts, mixed-currency receipts.
4. Ship FE update consuming the new LAK-denominated values.
5. Rollback: revert the mapper changes — values revert to previous (incorrect) state but no data is altered, so rollback is purely code-level.

## Open Questions

- Should the missing-rate exception be a 400 (client error) or a 500 (server-side config error)? Current code throws `BadRequestException`; arguably this is a server config problem, not a client problem. Defaulting to keep `BadRequestException` for consistency with the existing file, but flagging for review.
- Is there appetite to honour the per-item stored `exchange_rate` (historic) for receipts older than N days? Out of scope here, but worth tracking as a follow-up if finance raises it.
