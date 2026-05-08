## ADDED Requirements

### Requirement: PO item SHALL persist a LAK-equivalent valuation including VAT

Every Purchase Order (PO) item SHALL carry three persisted fields in addition to its native-currency `total`, `vat`, and `total_with_vat`:

- `rate` (decimal, 8 fractional digits): the exchange rate from the item's currency to LAK applied at save time. For LAK-native items this value SHALL be `1`.
- `total_in_lak` (decimal, 2 fractional digits): LAK-denominated value equal to `total * rate`, rounded to 2 fractional digits.
- `vat_in_lak` (decimal, 2 fractional digits): LAK-denominated VAT equal to `vat_total * rate`, rounded to 2 fractional digits. For items with no VAT this SHALL be `0`.

These fields SHALL be non-null for every newly created or updated PO item. Historical rows SHALL be backfilled by the existing schema migration.

#### Scenario: Creating a PO item with a non-LAK currency and VAT

- **WHEN** a user submits a Create Purchase Order command containing an item priced in a non-LAK currency with computed `total` T and `vat_total` V
- **AND** an active exchange rate exists for that currency → LAK with value R
- **THEN** the persisted PO item SHALL have `rate = R`, `total_in_lak = T * R` (2 fractional digits), and `vat_in_lak = V * R` (2 fractional digits)
- **AND** the response DTO SHALL expose all three new fields

#### Scenario: Creating a PO item priced in LAK

- **WHEN** a user submits a Create Purchase Order command containing an item priced in LAK
- **THEN** the persisted PO item SHALL have `rate = 1`, `total_in_lak = total`, and `vat_in_lak = vat_total`
- **AND** no exchange rate lookup is required

#### Scenario: Updating a PO item recomputes LAK fields

- **WHEN** an Update Purchase Order command modifies an item's `total`, `vat_total`, or `currency_id`
- **THEN** the system SHALL re-resolve `rate` for the item's current currency and recompute both `total_in_lak` and `vat_in_lak`
- **AND** persist the new values in the same transaction

#### Scenario: No active exchange rate for the chosen currency

- **WHEN** a Create or Update Purchase Order command targets a non-LAK currency for which no active exchange rate is configured
- **THEN** the command SHALL fail with a domain error indicating the missing exchange rate
- **AND** no PO item SHALL be partially persisted

### Requirement: PO item LAK valuation SHALL be exposed in API responses

The Purchase Order item response DTO SHALL include `rate`, `total_in_lak`, and `vat_in_lak` alongside existing fields.

#### Scenario: Reading a PO with items via the query API

- **WHEN** a client fetches a Purchase Order through the read API
- **THEN** every item in the response SHALL include numeric `rate`, `total_in_lak`, and `vat_in_lak` fields
- **AND** the values SHALL match what is stored in the database
