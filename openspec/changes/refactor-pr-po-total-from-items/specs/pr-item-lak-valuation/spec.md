## ADDED Requirements

### Requirement: PR header response SHALL expose total_in_lak alongside the existing total

The Purchase Request response SHALL include a new field `total_in_lak: number` in addition to the existing `total` field. The two fields coexist:

- `total` (unchanged): native-currency aggregate computed at read time using current exchange rates, exactly as today.
- `total_in_lak` (new): LAK-denominated aggregate equal to `Σ item.total_in_lak` over every non-deleted item belonging to the PR, using the LAK values that were persisted on each item at submission time.

Specific rules for `total_in_lak`:

- Type: `number`. Field name: `total_in_lak`.
- An item whose persisted `total_in_lak` is `null` or absent SHALL contribute `0` to the sum (defensive default; the per-item requirement already ensures non-null on all current rows).
- The read pipeline SHALL NOT issue any extra query against `exchange_rates` to compute `total_in_lak` — items already carry their LAK value.
- The presence or value of `total_in_lak` SHALL NOT affect the value of `total`. The two are independent.

#### Scenario: GET PR exposes both total and total_in_lak

- **WHEN** a client fetches a Purchase Request whose items have persisted `total_in_lak` values `[12_000, 8_500, 50_000]`
- **THEN** the response SHALL include the existing `total` field with its current today-rate value
- **AND** the response SHALL include `total_in_lak` equal to `70_500`

#### Scenario: total_in_lak is stable across exchange-rate changes

- **WHEN** a Purchase Request is created at time T with `total_in_lak = X`
- **AND** the active `currency → LAK` exchange rate for one of its items changes between T and T+1
- **AND** the same Purchase Request is fetched at T+1 with no item modification in between
- **THEN** the response `total_in_lak` at T+1 SHALL still equal `X` (the sum of the persisted item LAK values from T)
- **AND** the response `total` at T+1 MAY differ from its value at T (it is recomputed at the new rate, by design)

#### Scenario: GET list of PRs includes total_in_lak per row

- **WHEN** a client fetches a paginated list of Purchase Requests
- **THEN** every row SHALL include `total_in_lak` equal to `Σ item.total_in_lak` for that PR
- **AND** every row SHALL also include the existing `total` field unchanged

#### Scenario: Item with null total_in_lak contributes zero to the header sum

- **WHEN** a Purchase Request contains an item whose persisted `total_in_lak` is `null`
- **THEN** that item SHALL contribute `0` to the response `total_in_lak`
- **AND** the response SHALL NOT throw, return `NaN`, or otherwise fail
