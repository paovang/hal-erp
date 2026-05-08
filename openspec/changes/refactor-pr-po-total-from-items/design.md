## Context

Per the `pr-item-lak-valuation` and `po-item-lak-valuation` capabilities, every PR/PO item already persists `total_in_lak` (PR + PO) and `vat_in_lak` (PO) at create/update time using the exchange rate that was active when the document was submitted. Despite this, the read pipeline currently has two related gaps:

1. **No header-level LAK aggregate.** PR exposes only `total` (computed as `Σ item.total_price * current_rate`), and PO exposes only `sub_total` / `vat` / `total` (computed analogously). These are useful native-currency views, but consumers that want the LAK aggregate that was approved at submission have to sum items themselves. The request is to *keep* the existing fields and *add* new `*_in_lak` header fields populated from the items' persisted LAK values.
   - PR header sum is computed in [purchase-request.mapper.ts:69-87](src/modules/manage/infrastructure/mappers/purchase-request.mapper.ts#L69-L87).
   - PO header sums are computed in [purchase-order.mapper.ts:68-106](src/modules/manage/infrastructure/mappers/purchase-order.mapper.ts#L68-L106).

2. **Item-level LAK fields come back null in responses despite DB having values.** The shared QueryBuilder column whitelists in [src/common/constants/select-field.ts](src/common/constants/select-field.ts) — `selectPurchaseRequestItems` (line 203), `selectRequestItems` (line 226, same table under alias `request_items`), and `selectPurchaseOrderItems` (line 2) — were never updated when `pr-item-lak-valuation` / `po-item-lak-valuation` added the LAK columns. The reads therefore never SELECT `rate`, `total_in_lak`, or `vat_in_lak`; the ORM rows surface those fields as `undefined`; and the application mapper (`entity.total_in_lak !== null ? Number(entity.total_in_lak) : null`) emits `null` even though the DB row has a real value. This violates the existing item-LAK "exposed in API responses" requirements, and it would also silently neuter the new header LAK aggregates (Σ undefined → 0). Fixing the projection is therefore a prerequisite of the new header fields, not a separate cleanup.

## Goals / Non-Goals

**Goals:**
- Add a header-level LAK aggregate to PR responses (`total_in_lak`) and to PO responses (`sub_total_in_lak`, `vat_total_in_lak`, `total_in_lak`) by summing the items' persisted LAK fields.
- Make item LAK fields (`rate`, `total_in_lak`, `vat_in_lak`) flow correctly from DB to response — non-null where the DB has values.
- Preserve every existing field and every existing numeric value: `total` (PR), `sub_total` / `vat` / `total` (PO) are not changed.
- Keep the change additive and backward-compatible at the API layer.

**Non-Goals:**
- Changing how items themselves compute or persist `total_in_lak` / `vat_in_lak` — that is owned by the existing item-LAK valuation specs and remains intact.
- Adding a stored header-LAK column on `purchase_requests` / `purchase_orders` — items are the source of truth; the header sum is derived in the mapper.
- Replacing or modifying the existing `total` / `sub_total` / `vat` exchange-rate aggregation. They stay exactly as today.
- Removing the `ExchangeRateOrmEntity` dependency from these mappers (it is still needed for the existing aggregation).
- Changes to write-side commands, controllers, or item-level response DTOs.

## Decisions

### Decision 1: Add the new aggregates alongside the existing ones in the data-access mapper

**Choice:** In [PurchaseRequestDataAccessMapper.toEntity](src/modules/manage/infrastructure/mappers/purchase-request.mapper.ts) and [PurchaseOrderDataAccessMapper.toEntity](src/modules/manage/infrastructure/mappers/purchase-order.mapper.ts), keep the existing exchange-rate-based `total` (PR) and `sub_total` / `vat` / `total` (PO) computations exactly as they are today. *In addition*, after the existing computation, add new local sums:

- PR: `const total_in_lak = items.reduce((s, it) => s + Number(it.total_in_lak || 0), 0);`
- PO:
  - `const sub_total_in_lak = items.reduce((s, it) => s + Number(it.total_in_lak || 0), 0);`
  - `const vat_total_in_lak = items.reduce((s, it) => s + Number(it.vat_in_lak || 0), 0);`
  - `const total_in_lak = sub_total_in_lak + vat_total_in_lak;`

Pass these into the entity builder via new setters (see Decision 3).

**Why this layer:** The current header aggregation already lives in the infrastructure mapper. Putting the new aggregation right next to it keeps related logic together, reuses the already-loaded `items` array (no extra query), and keeps the application layer dumb.

**Alternative considered:** Do the new sums in the application mapper (`application/mappers/purchase-{request,order}.mapper.ts`) over `entity.purchaseRequestItems` / `entity.orderItems`. Workable, but would require both layers to know about the field and would split related computation across layers; rejected for cohesion.

### Decision 2: Coerce item LAK values via `Number(...)` and treat null/undefined as 0

**Choice:** Aggregate as `sum + Number(item.total_in_lak || 0)` (and analogous for `vat_in_lak`).

**Why:** `total_in_lak` and `vat_in_lak` are TypeORM `decimal` columns and surface as strings on the ORM entity. The current code already uses `Number(item.total_price || 0)` / `Number(item.total || 0)`, so this matches the existing convention. Per the existing item-LAK specs, these fields are non-null on every newly-created/updated item and historical rows were backfilled — so the `|| 0` is a defensive default, not a real branch.

### Decision 3: Extend the domain entity, builder, response DTO, and application mapper for each new field

**Choice:** Wire each new header field end-to-end through the existing layers, mirroring how `total` (PR) and `sub_total` / `vat` / `total` (PO) are wired today.

For PR (one new field, `total_in_lak`):
- [purchase-request.entity.ts](src/modules/manage/domain/entities/purchase-request.entity.ts): add `private readonly _total_in_lak: number | 0`, assign from builder, add `get total_in_lak(): number | 0`.
- [purchase-request.builder.ts](src/modules/manage/domain/builders/purchase-request.builder.ts): add `total_in_lak: number | 0` and `setTotalInLak(total_in_lak: number | 0): this`.
- [purchase-request.response.ts](src/modules/manage/application/dto/response/purchase-request.response.ts): add `@ApiProperty() total_in_lak: number | 0;` after the existing `total`.
- [application/mappers/purchase-request.mapper.ts](src/modules/manage/application/mappers/purchase-request.mapper.ts): set `response.total_in_lak = Number(entity.total_in_lak ?? 0);`.
- Infrastructure mapper: call `.setTotalInLak(total_in_lak)` on the builder (after the existing `.setTotal(total)`).

For PO (three new fields):
- [purchase-order.entity.ts](src/modules/manage/domain/entities/purchase-order.entity.ts): add three private fields, getters.
- [purchase-order.builder.ts](src/modules/manage/domain/builders/purchase-order.builder.ts): add three properties + `setSubTotalInLak`, `setVatTotalInLak`, `setTotalInLak`.
- [purchase-order.response.ts](src/modules/manage/application/dto/response/purchase-order.response.ts): add three `@ApiProperty()` fields after the existing `total`.
- [application/mappers/purchase-order.mapper.ts](src/modules/manage/application/mappers/purchase-order.mapper.ts): copy all three.
- Infrastructure mapper: call the three new setters after the existing `.setSubTotal(...).setVat(...).setTotal(...)`.

**Naming:** `sub_total_in_lak`, `vat_total_in_lak`, `total_in_lak` mirror PO's existing `sub_total`, `vat`, `total` 1:1 (note `vat_total_in_lak` rather than `vat_in_lak` to avoid colliding with the per-item `vat_in_lak` field, which is a different scope). PR uses just `total_in_lak` to mirror its single existing `total`.

**Alternative considered:** Make the entity getters compute the LAK sums on demand from `this._purchaseRequestItem` / `this._orderItem` instead of storing them. Slightly cleaner, but the entity items can be empty when the entity is read for write paths (commands), and the existing pattern stores these aggregates as fields; staying consistent matters more than purity here.

### Decision 4: Fix the projection at the shared constants file, not per-repository

**Choice:** Add the LAK columns to the three lists in [src/common/constants/select-field.ts](src/common/constants/select-field.ts):

- `selectPurchaseRequestItems` ← `'purchase_request_items.rate'`, `'purchase_request_items.total_in_lak'`
- `selectRequestItems` ← `'request_items.rate'`, `'request_items.total_in_lak'` (same table, alias `request_items`, used when joining from a PO)
- `selectPurchaseOrderItems` ← `'purchase_order_items.rate'`, `'purchase_order_items.total_in_lak'`, `'purchase_order_items.vat_in_lak'`

These constants are spread into `addSelect(...)` in four read repositories: [purchaseRequest/read.repository.ts](src/modules/manage/infrastructure/repositories/purchaseRequest/read.repository.ts), [purchaseOrder/read.repository.ts](src/modules/manage/infrastructure/repositories/purchaseOrder/read.repository.ts), [receipt/read.repository.ts](src/modules/manage/infrastructure/repositories/receipt/read.repository.ts), and [reports/.../reportPurchaseOrder/read.repository.ts](src/modules/reports/infrastructure/repositories/reportPurchaseOrder/read.repository.ts). Editing the shared constants fixes all four call sites in one place; the per-repository code stays untouched.

**Why one place, not four:** the constants exist to centralize the projection. Forking it per repo would re-introduce drift the moment another LAK-style column is added.

**Why the column rather than the relation:** these are scalar columns on the items table — adding them to the `addSelect` list is the standard fix. The `currency` relation join is unaffected. We deliberately do *not* add `currency_id` to the lists, because the response DTOs don't expose `currency_id` directly (they expose the joined `currency` object), so adding it would broaden the projection without serving the response.

**Alternative considered:** Switch the read repositories from explicit `addSelect(selectFields)` to TypeORM's default "select everything" behavior. Rejected — those repositories deliberately whitelist columns to keep payloads small across many joins; flipping them open risks fanning out unrelated fields.

### Decision 5: Keep the API contract additive, not breaking

**Choice:** Existing fields (`total` on PR; `sub_total`, `vat`, `total` on PO; per-item native-currency fields) keep their current names, types, and computed values. New `*_in_lak` fields are appended.

**Why:** Downstream clients (frontend, exports, reports) keep working without any coordinated change. New consumers can opt into the LAK aggregate at their own pace.

## Risks / Trade-offs

- **[Risk] Two header totals living side by side may confuse consumers ("which one do I use?").** → **Mitigation:** Document the distinction in the response DTO field doc / Swagger description: `total` is the today-rate native sum (in the user's display currency, summed in LAK at current rate); `*_in_lak` is the historical LAK figure that was approved. The frontend should pick deliberately based on the screen's intent.
- **[Risk] Items missing `total_in_lak` / `vat_in_lak` in old rows that escaped backfill.** → **Mitigation:** The existing item-LAK specs require backfill, and the `Number(... || 0)` coercion makes a stray null a 0 rather than NaN. A spot-check query before merging will confirm zero exposure (`SELECT COUNT(*) FROM purchase_request_items WHERE total_in_lak IS NULL`, same for PO items / `vat_in_lak`).
- **[Risk] PO's nested `purchase_requests` mapping (`purchase-order.mapper.ts:125-129`) calls `_purchaseRequest.toEntity(...)` which also runs the PR aggregation.** → **Mitigation:** Both mappers are extended in the same PR, so the nested PR will also gain the new `total_in_lak` field automatically.
- **[Risk] Visible response-shape change for unrelated callers.** Receipt and Reports endpoints reuse the same projection constants and will start returning previously-null `rate` / `total_in_lak` / `vat_in_lak` on items. → **Mitigation:** This actually moves them into compliance with the existing item-LAK "exposed in API responses" requirement, so it's a fix rather than a regression. Smoke-test at least one Receipt and one Reports PO endpoint after the change to confirm no client parses these as "must-be-null" sentinels.
- **[Trade-off] Computed twice in the mapper.** The infrastructure mapper now does two reductions over `items` instead of one. → Accepted; `items` is already in memory and reductions are O(n).
- **[Trade-off] Aggregation stays in the infrastructure mapper rather than moving onto the domain entity.** Slightly off-ideal for DDD purity. → Accepted; consistent with the existing pattern.

## Migration Plan

1. Pre-merge sanity check (production read-replica): confirm `purchase_request_items.total_in_lak`, `purchase_order_items.total_in_lak`, `purchase_order_items.vat_in_lak` are non-null for all rows. If any nulls exist, file a backfill task before merging.
2. Deploy the projection-constants edit, the entity/builder/response/mapper extensions together. No DB migration is required.
3. Smoke-test GET single PR, GET list PR, GET single PO (including one PO whose underlying PR uses a non-LAK currency), GET list PO, plus one Receipt endpoint and one Reports PO endpoint. Verify (a) item `rate` / `total_in_lak` / `vat_in_lak` are populated (not null) and match the DB; (b) header `total` (and PO `sub_total`/`vat`/`total`) are unchanged from before the deploy; (c) the new header `*_in_lak` fields are present and equal `Σ item.total_in_lak` (and for PO, `Σ item.vat_in_lak` / their sum).
4. Rollback strategy: pure code revert. No data migration to undo.

## Open Questions

- Confirm with the frontend team which header field each screen should show going forward (`total` vs `total_in_lak`, etc.). Surface this in the PR description so design / FE can plan the UX migration.
