## ADDED Requirements

### Requirement: PO header response SHALL expose sub_total_in_lak, vat_total_in_lak, and total_in_lak alongside the existing sub_total, vat, and total

The Purchase Order response SHALL include three new fields in addition to the existing `sub_total`, `vat`, and `total`. The new fields and the existing fields coexist:

- `sub_total`, `vat`, `total` (unchanged): native-currency aggregates computed at read time using current exchange rates, exactly as today.
- `sub_total_in_lak: number` (new): LAK-denominated sub-total equal to `Σ item.total_in_lak` over every non-deleted PO item.
- `vat_total_in_lak: number` (new): LAK-denominated VAT total equal to `Σ item.vat_in_lak` over every non-deleted PO item.
- `total_in_lak: number` (new): grand total in LAK equal to `sub_total_in_lak + vat_total_in_lak`.

Specific rules for the new fields:

- Types: all `number`. Field names exactly as above (note `vat_total_in_lak`, not `vat_in_lak`, to avoid colliding with the per-item `vat_in_lak` field).
- An item whose persisted `total_in_lak` or `vat_in_lak` is `null` or absent SHALL contribute `0` to its respective sum (defensive default; the per-item requirement already ensures non-null on all current rows).
- The read pipeline SHALL NOT issue any extra query against `exchange_rates` to compute the new fields — items already carry their LAK values.
- The presence or value of the new fields SHALL NOT affect the value of `sub_total`, `vat`, or `total`. The two sets are independent.

#### Scenario: GET PO exposes both native-currency and LAK header aggregates

- **WHEN** a client fetches a Purchase Order whose items have persisted `(total_in_lak, vat_in_lak)` of `[(100_000, 7_000), (50_000, 3_500)]`
- **THEN** the response SHALL include the existing `sub_total`, `vat`, and `total` fields with their current today-rate values
- **AND** the response SHALL include `sub_total_in_lak = 150_000`, `vat_total_in_lak = 10_500`, and `total_in_lak = 160_500`

#### Scenario: New LAK header fields are stable across exchange-rate changes

- **WHEN** a Purchase Order is created at time T with `(sub_total_in_lak, vat_total_in_lak, total_in_lak) = (S, V, S + V)`
- **AND** the active `currency → LAK` exchange rate for one of its items changes between T and T+1
- **AND** the same Purchase Order is fetched at T+1 with no item modification in between
- **THEN** the response at T+1 SHALL still report `(sub_total_in_lak, vat_total_in_lak, total_in_lak) = (S, V, S + V)`
- **AND** the response `sub_total` / `vat` / `total` at T+1 MAY differ from their values at T (recomputed at the new rate, by design)

#### Scenario: GET list of POs includes the new LAK fields per row

- **WHEN** a client fetches a paginated list of Purchase Orders
- **THEN** every row SHALL include `sub_total_in_lak`, `vat_total_in_lak`, and `total_in_lak` derived from that PO's items' persisted LAK fields per the rules above
- **AND** every row SHALL also include the existing `sub_total` / `vat` / `total` fields unchanged

#### Scenario: PO whose underlying PR is also returned exposes total_in_lak on the nested PR

- **WHEN** a client fetches a Purchase Order whose response includes the nested `purchase_requests` payload
- **THEN** the nested PR SHALL also include `total_in_lak` per the `pr-item-lak-valuation` header rule
- **AND** the nested PR's existing `total` field SHALL remain unchanged

#### Scenario: Item with null LAK fields contributes zero

- **WHEN** a Purchase Order contains an item whose persisted `total_in_lak` is `null` or whose `vat_in_lak` is `null`
- **THEN** that item SHALL contribute `0` to the respective response field (`sub_total_in_lak` for the former, `vat_total_in_lak` for the latter)
- **AND** the response SHALL NOT throw, return `NaN`, or otherwise fail
