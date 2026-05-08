## Why

The Purchase Request (PR) and Purchase Order (PO) read APIs currently expose only one header total per document — `total` for PR, and `sub_total` / `vat` / `total` for PO — all computed at read time by multiplying each item's native-currency total by a freshly-loaded exchange rate. This figure is useful for native-currency reporting, but it is *not* the LAK figure that was approved at submission: rates can change between submit and read, and a single PO can mix items in multiple currencies. Each item already persists `total_in_lak` (PR + PO) and `vat_in_lak` (PO) per `pr-item-lak-valuation` / `po-item-lak-valuation`, but the header response gives the consumer no way to read the LAK aggregate without summing items client-side.

Separately, the read pipeline has a defect: the QueryBuilder column whitelists in `src/common/constants/select-field.ts` were never updated when the LAK columns were added, so item responses come back with `rate: null`, `total_in_lak: null`, and (for PO items) `vat_in_lak: null` even when the database has real values. Both problems share a fix path, so they are addressed together.

## What Changes

- PR header response SHALL keep the existing `total` field computed via current exchange rates, and SHALL ADD a new field `total_in_lak: number` equal to `Σ item.total_in_lak` over the PR's items.
- PO header response SHALL keep the existing `sub_total`, `vat`, and `total` fields computed via current exchange rates, and SHALL ADD three new fields:
  - `sub_total_in_lak: number` = `Σ item.total_in_lak`
  - `vat_total_in_lak: number` = `Σ item.vat_in_lak`
  - `total_in_lak: number` = `sub_total_in_lak + vat_total_in_lak`
- The PR/PO domain entities, builders, application mappers, and response DTOs SHALL be extended with the new fields. The infrastructure mappers SHALL compute the new sums from items (in addition to, not in place of, the existing exchange-rate aggregation) and pass them into the entity builder.
- The shared QueryBuilder projection whitelists in `src/common/constants/select-field.ts` (`selectPurchaseRequestItems`, `selectRequestItems`, `selectPurchaseOrderItems`) SHALL be updated to include `rate` and `total_in_lak` (PR items, both aliases) and `rate`, `total_in_lak`, `vat_in_lak` (PO items). Without this, the read query never asks PostgreSQL for the LAK columns, the ORM rows surface `undefined`, item responses show `null`, and the new header sums collapse to `0`. This fix is shared between the item-level null defect and the new header sums.
- **Defect resolved**: items returned by GET PR / GET PO (and any consumer that uses these projection constants — Receipt read repo, Reports PO read repo) will now expose non-null `rate`, `total_in_lak`, and `vat_in_lak` values that match the database, satisfying the existing "PR/PO item LAK valuation SHALL be exposed in API responses" requirements that are currently violated by the missing projection columns.
- **Non-breaking**: existing fields and existing numeric values are unchanged. Clients that already read `total` / `sub_total` / `vat` keep working unchanged. The new fields are additive.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `pr-item-lak-valuation`: add a header-level requirement that the PR response exposes `total_in_lak` derived from `Σ item.total_in_lak`, alongside the existing native-currency `total`.
- `po-item-lak-valuation`: add a header-level requirement that the PO response exposes `sub_total_in_lak`, `vat_total_in_lak`, and `total_in_lak` derived from `Σ item.total_in_lak` and `Σ item.vat_in_lak`, alongside the existing native-currency `sub_total` / `vat` / `total`.

## Impact

- **Code**:
  - [src/common/constants/select-field.ts](src/common/constants/select-field.ts) — extend `selectPurchaseRequestItems` (line 203) with `'purchase_request_items.rate'` and `'purchase_request_items.total_in_lak'`; extend `selectRequestItems` (line 226) with `'request_items.rate'` and `'request_items.total_in_lak'`; extend `selectPurchaseOrderItems` (line 2) with `'purchase_order_items.rate'`, `'purchase_order_items.total_in_lak'`, and `'purchase_order_items.vat_in_lak'`.
  - [src/modules/manage/domain/entities/purchase-request.entity.ts](src/modules/manage/domain/entities/purchase-request.entity.ts) and [purchase-request.builder.ts](src/modules/manage/domain/builders/purchase-request.builder.ts) — add `_total_in_lak` field, `total_in_lak` getter, builder property + `setTotalInLak(...)`.
  - [src/modules/manage/domain/entities/purchase-order.entity.ts](src/modules/manage/domain/entities/purchase-order.entity.ts) and [purchase-order.builder.ts](src/modules/manage/domain/builders/purchase-order.builder.ts) — add `_sub_total_in_lak`, `_vat_total_in_lak`, `_total_in_lak` fields, getters, builder properties + setters.
  - [src/modules/manage/application/dto/response/purchase-request.response.ts](src/modules/manage/application/dto/response/purchase-request.response.ts) and [purchase-order.response.ts](src/modules/manage/application/dto/response/purchase-order.response.ts) — add the new fields to the response DTOs.
  - [src/modules/manage/application/mappers/purchase-request.mapper.ts](src/modules/manage/application/mappers/purchase-request.mapper.ts) and [purchase-order.mapper.ts](src/modules/manage/application/mappers/purchase-order.mapper.ts) (application layer) — copy the new entity fields onto the response DTO.
  - [src/modules/manage/infrastructure/mappers/purchase-request.mapper.ts](src/modules/manage/infrastructure/mappers/purchase-request.mapper.ts) — keep the existing `total` aggregation; add a parallel sum `Σ item.total_in_lak` and pass it into `setTotalInLak(...)`.
  - [src/modules/manage/infrastructure/mappers/purchase-order.mapper.ts](src/modules/manage/infrastructure/mappers/purchase-order.mapper.ts) — keep the existing `sub_total` / `vat` aggregation; add parallel sums `Σ item.total_in_lak`, `Σ item.vat_in_lak`, derive `total_in_lak`, and pass all three into the builder via new setters.
- **APIs affected**:
  - Direct: GET single PR, GET list PR, GET single PO, GET list PO will start exposing the new header `*_in_lak` fields.
  - Indirect (projection only — they reuse the same select lists): Receipt read endpoints (`src/modules/manage/infrastructure/repositories/receipt/read.repository.ts`) and Reports PO endpoints (`src/modules/reports/infrastructure/repositories/reportPurchaseOrder/read.repository.ts`). These will start returning previously-null `rate` / `total_in_lak` / `vat_in_lak` on items.
- **Database**: none. The required item columns (`rate`, `total_in_lak`, `vat_in_lak`) already exist and were backfilled by the migrations introduced with `pr-item-lak-valuation` / `po-item-lak-valuation`.
- **Behavior change**: existing fields and existing numeric values are preserved. New header `*_in_lak` fields are added; item LAK fields are no longer null in responses where the DB has values.
