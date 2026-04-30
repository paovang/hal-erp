## Why

The receipt list (`GET /api/receipts`) and receipt detail (`GET /api/receipts/:id`) APIs currently return monetary fields (`total`, `sub_total`, `vat`, and the per-currency `currency_totals` array) in the **item's source currency** instead of converting them to **LAK** using the active exchange rate. This is inconsistent with how other modules expose totals to clients and forces the front-end to perform conversion logic, producing incorrect aggregate amounts whenever a receipt contains items priced in a non-LAK currency.

## What Changes

- Apply the active currency-to-LAK exchange rate to receipt totals **inside the read path** so that the API response carries LAK values.
- Use the **payment currency** of each receipt item (not the product currency) to look up the exchange rate, matching how the stored `payment_total` and `vat` are denominated.
- Ensure the top-level `total`, `sub_total`, and `vat` on the receipt response are the LAK-converted amounts.
- Ensure each entry in the `currency_totals` array carries LAK-converted `total`, `vat`, and `amount`, while still preserving the original currency `code`/`name` so the UI can display "originally THB" alongside the LAK value.
- Fail fast with a clear error when no active `<from_currency> → LAK` exchange rate exists for a receipt item's payment currency, so silent miscalculation is impossible.
- **No DB schema changes**: stored `payment_total` / `vat` / `exchange_rate` columns remain unchanged; conversion happens at the read/mapper layer only.

## Capabilities

### New Capabilities
- `receipt-currency-conversion`: Defines how the receipt read APIs convert per-item monetary fields into LAK using exchange rates before responding, and how they behave when a rate is missing.

### Modified Capabilities
<!-- None — no existing specs in openspec/specs/ -->

## Impact

- **Affected APIs**:
  - `GET /api/receipts` (list)
  - `GET /api/receipts/:id` (detail)
  - `GET /api/receipts/:id/print` (consumes the same mapper, will inherit the fix)
- **Affected code**:
  - [src/modules/manage/infrastructure/mappers/receipt.mapper.ts](src/modules/manage/infrastructure/mappers/receipt.mapper.ts) — `toEntity` and `calculateCurrencyTotalsFromItems`
  - [src/modules/manage/application/mappers/receipt.mapper.ts](src/modules/manage/application/mappers/receipt.mapper.ts) — `toResponse` (verify it surfaces converted values)
  - [src/modules/manage/application/dto/response/receipt.response.ts](src/modules/manage/application/dto/response/receipt.response.ts) — Swagger doc on monetary fields should note the unit is LAK
- **Dependencies**:
  - Reads from `ExchangeRateOrmEntity` (already injected in `ReceiptDataAccessMapper`).
  - Behaviour depends on having an active `from_currency → LAK` rate for every payment currency used on receipt items.
- **Breaking change for clients?** Yes for any client that was consuming the old (item-currency) values as authoritative. Must coordinate the front-end release. Marked **BREAKING** for downstream consumers of the receipt list/detail responses.
- **Out of scope**: purchase-order and purchase-request total conversion (separate change), and historical exchange-rate lookup by receipt date (current behaviour uses the active rate, same as before).
