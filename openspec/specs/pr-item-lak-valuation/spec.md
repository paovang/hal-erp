# pr-item-lak-valuation Specification

## Purpose

Persist a LAK-equivalent valuation on every Purchase Request (PR) item so reporting, exports, and downstream consumers can read the LAK amount directly without re-resolving exchange rates. Each PR item carries the exchange rate that was applied (`rate`) and the LAK-denominated total (`total_in_lak`) alongside its native-currency `price` and `total_price`.

## Requirements

### Requirement: PR item SHALL persist a LAK-equivalent valuation

Every Purchase Request (PR) item SHALL carry two persisted fields in addition to its native-currency `price` and `total_price`:

- `rate` (decimal, 8 fractional digits): the exchange rate from the item's currency to LAK that was applied when the LAK valuation was computed. For LAK-native items this value SHALL be `1`.
- `total_in_lak` (decimal, 2 fractional digits): the LAK-denominated amount equal to `total_price * rate`, rounded to 2 fractional digits using the system's standard rounding convention.

These fields SHALL be non-null for every newly created or updated PR item. Historical rows SHALL be backfilled by the existing schema migration.

#### Scenario: Creating a PR item with a non-LAK currency

- **WHEN** a user submits a Create Purchase Request command containing an item priced in a non-LAK currency (e.g. USD) with `quantity` Q, `price` P
- **AND** an active exchange rate exists for that currency → LAK with value R
- **THEN** the persisted PR item SHALL have `total_price = Q * P`, `rate = R`, and `total_in_lak = Q * P * R` rounded to 2 fractional digits
- **AND** the response DTO SHALL expose `rate` and `total_in_lak` to the API consumer

#### Scenario: Creating a PR item priced in LAK

- **WHEN** a user submits a Create Purchase Request command containing an item priced in LAK
- **THEN** the persisted PR item SHALL have `rate = 1` and `total_in_lak = total_price`
- **AND** no exchange rate lookup is required

#### Scenario: Updating a PR item changes price, quantity, or currency

- **WHEN** a user submits an Update Purchase Request command that modifies an item's `price`, `quantity`, or `currency_id`
- **THEN** the system SHALL recompute `total_price`, re-resolve `rate` for the (possibly new) currency, and recompute `total_in_lak`
- **AND** persist all three values in the same transaction

#### Scenario: No active exchange rate for the chosen currency

- **WHEN** a Create or Update Purchase Request command targets a non-LAK currency for which no active exchange rate is configured
- **THEN** the command SHALL fail with a domain error indicating the missing exchange rate
- **AND** no PR item SHALL be partially persisted

### Requirement: PR item LAK valuation SHALL be exposed in API responses

The Purchase Request item response DTO SHALL include `rate` and `total_in_lak` fields alongside existing fields, so any client (including reporting and excel export) can read the LAK valuation without re-deriving it.

#### Scenario: Reading a PR with items via the query API

- **WHEN** a client fetches a Purchase Request through the read API
- **THEN** every item in the response SHALL include numeric `rate` and `total_in_lak` fields
- **AND** the values SHALL match what is stored in the database
