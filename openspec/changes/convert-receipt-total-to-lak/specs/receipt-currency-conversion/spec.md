## ADDED Requirements

### Requirement: Receipt monetary fields SHALL be returned in LAK
The receipt list (`GET /api/receipts`) and receipt detail (`GET /api/receipts/:id`) endpoints SHALL return the top-level monetary fields (`total`, `sub_total`, `vat`) denominated in **LAK**, regardless of the payment currency stored on individual receipt items.

#### Scenario: Receipt with all items in LAK
- **WHEN** a receipt has every item with `payment_currency_id` resolving to currency code `LAK`
- **THEN** the response `total`, `sub_total`, and `vat` SHALL equal the raw sums of `payment_total` and `vat` across items (rate of 1 applied)

#### Scenario: Receipt with items in a single foreign payment currency
- **WHEN** a receipt has every item paid in a non-LAK currency `X` and an active exchange rate row exists with `from_currency = X`, `to_currency = LAK`, `is_active = true`, and `rate = R`
- **THEN** the response `sub_total` SHALL equal `Σ(item.payment_total) × R`
- **AND** the response `vat` SHALL equal `Σ(item.vat) × R`
- **AND** the response `total` SHALL equal `sub_total + vat`

#### Scenario: Receipt with mixed payment currencies across items
- **WHEN** a receipt has items in multiple payment currencies, each with an active rate to LAK
- **THEN** each item's `payment_total` and `vat` SHALL be converted to LAK using its own payment-currency rate before summing
- **AND** the response top-level `sub_total`, `vat`, and `total` SHALL be the LAK-denominated sums

### Requirement: `currency_totals` array SHALL aggregate by payment currency in LAK
The receipt response `currency_totals[]` array SHALL contain one entry per distinct **payment currency** appearing on the receipt's items. Each entry's `total`, `vat`, and `amount` fields SHALL be expressed in LAK, while `id`, `code`, and `name` SHALL identify the original payment currency.

#### Scenario: Multiple items share one payment currency
- **WHEN** two or more items on a receipt share the same `payment_currency_id`
- **THEN** the `currency_totals[]` array SHALL contain exactly one entry for that currency
- **AND** the entry's `total` SHALL equal `Σ(item.payment_total) × rate_to_LAK` for those items
- **AND** the entry's `vat` SHALL equal `Σ(item.vat) × rate_to_LAK` for those items
- **AND** the entry's `amount` SHALL equal `total + vat`

#### Scenario: Items span multiple payment currencies
- **WHEN** a receipt's items use N distinct payment currencies
- **THEN** `currency_totals[]` SHALL contain exactly N entries
- **AND** each entry's `code` and `name` SHALL reflect that entry's original payment currency (not `LAK`)
- **AND** each entry's `total`/`vat`/`amount` SHALL be the LAK-converted sums

### Requirement: Exchange rate lookup SHALL use payment currency
Currency conversion to LAK SHALL look up the exchange rate by the receipt item's `payment_currency_id` (not the product `currency_id`), because `payment_total` and `vat` are stored in the payment currency.

#### Scenario: Item's product currency differs from payment currency
- **WHEN** an item has `currency_id = USD` and `payment_currency_id = THB` and `payment_total = 1000`
- **AND** an active exchange rate exists from `THB → LAK` with `rate = 600`
- **THEN** that item SHALL contribute `600,000 LAK` to `sub_total` (1000 × 600)
- **AND** the rate from `USD → LAK` SHALL NOT be used for that item

### Requirement: Missing exchange rate SHALL produce a clear error
If a receipt contains any item whose payment currency has no active `→ LAK` exchange rate row, the read endpoints SHALL fail with a `BadRequestException` whose message identifies the missing currency pair.

#### Scenario: No active rate for a payment currency
- **WHEN** a receipt item's `payment_currency_id` resolves to a currency code that has no active row in `exchange_rates` with `to_currency.code = 'LAK'`
- **THEN** the request SHALL fail with HTTP 400
- **AND** the error message SHALL identify the missing source currency (id and/or code)
- **AND** the response SHALL NOT contain partial or unconverted monetary data

### Requirement: Conversion behaviour SHALL be consistent across receipt read paths
All read paths that map a `ReceiptOrmEntity` to a `ReceiptEntity` (list, detail, print) SHALL apply the same LAK conversion rules so that totals are identical for the same receipt regardless of which endpoint returned it.

#### Scenario: Same receipt fetched via list and detail
- **WHEN** the same receipt is retrieved via `GET /api/receipts` and `GET /api/receipts/:id`
- **THEN** both responses SHALL report the same `total`, `sub_total`, `vat`, and `currency_totals[]` LAK values

#### Scenario: Same receipt fetched via print endpoint
- **WHEN** a receipt is retrieved via `GET /api/receipts/:id/print`
- **THEN** the embedded receipt SHALL report the same LAK monetary values as the list/detail endpoints
