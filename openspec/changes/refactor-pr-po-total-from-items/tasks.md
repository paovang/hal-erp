## 1. Pre-flight verification

- [ ] 1.1 Run a read-replica query: `SELECT COUNT(*) FROM purchase_request_items WHERE total_in_lak IS NULL` and the equivalent for `purchase_order_items.total_in_lak` and `purchase_order_items.vat_in_lak`. Confirm all are zero. If not, file a backfill ticket and stop.
- [ ] 1.2 Confirm with the frontend team which screens will adopt the new `*_in_lak` header fields versus keep displaying the existing `total` / `sub_total` / `vat`. Note the answer in the PR description (does not block this PR — fields are additive — but it informs the FE follow-up).

## 2. Fix QueryBuilder projection whitelists (prerequisite — without this, the new header sums collapse to 0 and item LAK fields stay null)

- [x] 2.1 In [src/common/constants/select-field.ts](src/common/constants/select-field.ts), extend `selectPurchaseRequestItems` (line 203) to add `'purchase_request_items.rate'` and `'purchase_request_items.total_in_lak'`.
- [x] 2.2 In the same file, extend `selectRequestItems` (line 226 — same table, alias `request_items`, used when joining from a PO) to add `'request_items.rate'` and `'request_items.total_in_lak'`.
- [x] 2.3 In the same file, extend `selectPurchaseOrderItems` (line 2) to add `'purchase_order_items.rate'`, `'purchase_order_items.total_in_lak'`, and `'purchase_order_items.vat_in_lak'`.
- [x] 2.4 Do NOT add `currency_id` to any of the three lists — the response DTOs expose `currency` (the joined object), not `currency_id`, so adding it would broaden the projection without serving the response.
- [x] 2.5 `pnpm run build` to confirm nothing else in the constants file or its consumers breaks.
- [ ] 2.6 Manually GET a single PR whose items have non-null `rate` / `total_in_lak` in the DB and confirm the response now exposes those exact values (not null). Same for PO single (including `vat_in_lak`). Same for one Receipt endpoint and one Reports PO endpoint that reuse these constants.

## 3. Extend PR domain entity, builder, and response DTO with total_in_lak

- [x] 3.1 In [src/modules/manage/domain/entities/purchase-request.entity.ts](src/modules/manage/domain/entities/purchase-request.entity.ts), add `private readonly _total_in_lak: number | 0;` next to `_total`. Assign `this._total_in_lak = builder.total_in_lak;` in the constructor. Add `get total_in_lak(): number | 0 { return this._total_in_lak; }` next to the existing `total` getter.
- [x] 3.2 In [src/modules/manage/domain/builders/purchase-request.builder.ts](src/modules/manage/domain/builders/purchase-request.builder.ts), add `total_in_lak: number | 0;` next to the existing `total` property and add `setTotalInLak(total_in_lak: number | 0): this { this.total_in_lak = total_in_lak; return this; }` next to `setTotal`.
- [x] 3.3 In [src/modules/manage/application/dto/response/purchase-request.response.ts](src/modules/manage/application/dto/response/purchase-request.response.ts), add `@ApiProperty() total_in_lak: number | 0;` immediately after the existing `total` field.
- [x] 3.4 In [src/modules/manage/application/mappers/purchase-request.mapper.ts](src/modules/manage/application/mappers/purchase-request.mapper.ts) (application-layer mapper), copy the new field onto the response: `response.total_in_lak = Number(entity.total_in_lak ?? 0);` immediately after the existing `response.total = ...` line.
- [x] 3.5 `pnpm run build` to confirm types compile.

## 4. Extend PO domain entity, builder, and response DTO with three new LAK fields

- [x] 4.1 In [src/modules/manage/domain/entities/purchase-order.entity.ts](src/modules/manage/domain/entities/purchase-order.entity.ts), add three private fields next to `_sub_total` / `_vat` / `_total`: `_sub_total_in_lak: number | 0`, `_vat_total_in_lak: number | 0`, `_total_in_lak: number | 0`. Assign all three from the builder in the constructor. Add corresponding getters next to the existing ones.
- [x] 4.2 In [src/modules/manage/domain/builders/purchase-order.builder.ts](src/modules/manage/domain/builders/purchase-order.builder.ts), add three properties (`sub_total_in_lak`, `vat_total_in_lak`, `total_in_lak`, all `number | 0`) and three setters: `setSubTotalInLak`, `setVatTotalInLak`, `setTotalInLak`, modeled exactly on the existing `setSubTotal` / `setVat` / `setTotal`.
- [x] 4.3 In [src/modules/manage/application/dto/response/purchase-order.response.ts](src/modules/manage/application/dto/response/purchase-order.response.ts), add three `@ApiProperty()` fields after the existing `total`: `sub_total_in_lak: number | 0`, `vat_total_in_lak: number | 0`, `total_in_lak: number | 0`.
- [x] 4.4 In [src/modules/manage/application/mappers/purchase-order.mapper.ts](src/modules/manage/application/mappers/purchase-order.mapper.ts) (application-layer mapper), copy the three new fields onto the response immediately after the existing `sub_total` / `vat` / `total` lines: `response.sub_total_in_lak = Number(entity.sub_total_in_lak ?? 0);` (and analogous for the other two).
- [x] 4.5 `pnpm run build` to confirm types compile.

## 5. Compute the new aggregates in the infrastructure mappers and pass them into the builder

- [x] 5.1 In [src/modules/manage/infrastructure/mappers/purchase-request.mapper.ts](src/modules/manage/infrastructure/mappers/purchase-request.mapper.ts), KEEP the existing exchange-rate aggregation that builds `total` exactly as it is. Immediately after the existing reduce block, add: `const total_in_lak: number = items.reduce((sum, item) => sum + Number((item as any).total_in_lak || 0), 0);` (use the same `PurchaseRequestItemLike` typing pattern already in the file — extend the local interface to include `total_in_lak?: string | number`).
- [x] 5.2 In the same file, add `.setTotalInLak(total_in_lak)` to the entity-builder chain immediately after the existing `.setTotal(total)`.
- [x] 5.3 In [src/modules/manage/infrastructure/mappers/purchase-order.mapper.ts](src/modules/manage/infrastructure/mappers/purchase-order.mapper.ts), KEEP the existing `sub_total` and `vat` reducers exactly as they are. Immediately after them, add three new local sums: `const sub_total_in_lak = items.reduce((sum, item) => sum + Number((item as any).total_in_lak || 0), 0);`, `const vat_total_in_lak = items.reduce((sum, item) => sum + Number((item as any).vat_in_lak || 0), 0);`, `const total_in_lak = sub_total_in_lak + vat_total_in_lak;`. Extend the local `PurchaseRequestItemLike` interface to include `total_in_lak?: string | number` and `vat_in_lak?: string | number`.
- [x] 5.4 In the same file, add `.setSubTotalInLak(sub_total_in_lak).setVatTotalInLak(vat_total_in_lak).setTotalInLak(total_in_lak)` to the entity-builder chain immediately after the existing `.setSubTotal(sub_total).setVat(vat).setTotal(total)`.
- [x] 5.5 Do NOT remove the `ExchangeRateOrmEntity` injection or the existing exchange-rate aggregation block in either mapper — they remain in use for the existing `total` / `sub_total` / `vat` fields.
- [x] 5.6 Run `pnpm run lint` and `pnpm run build` to confirm both files compile.

## 6. Manual smoke verification

- [ ] 6.1 Hit `GET /api/<pr-list-route>` and confirm: (a) every item exposes non-null `rate` / `total_in_lak` matching the DB; (b) every row's existing `total` is unchanged from before the deploy; (c) every row exposes the new `total_in_lak` equal to `Σ item.total_in_lak`.
- [ ] 6.2 Hit `GET /api/<pr-single-route>/:id` for a PR whose items use a non-LAK currency and confirm both fields are present and behave as in 6.1.
- [ ] 6.3 Hit `GET /api/<po-list-route>` and confirm: (a) every item exposes non-null `rate` / `total_in_lak` / `vat_in_lak`; (b) every row's existing `sub_total` / `vat` / `total` are unchanged; (c) every row exposes the new `sub_total_in_lak`, `vat_total_in_lak`, and `total_in_lak` equal to `Σ item.total_in_lak`, `Σ item.vat_in_lak`, and their sum respectively.
- [ ] 6.4 Hit `GET /api/<po-single-route>/:id` for a PO whose underlying PR carries multi-currency items and confirm both PO and the nested PR show the new `*_in_lak` fields, with non-null item LAK fields throughout.
- [ ] 6.5 Hit one Receipt endpoint and one Reports PO endpoint that reuse the projection constants, and confirm their item LAK fields are no longer null. Do not modify those modules; only verify the projection fix flows through.

## 7. Test coverage

- [x] 7.1 ~~Add or update a unit test for `PurchaseRequestDataAccessMapper.toEntity`~~ — **SKIPPED**: this codebase has zero existing tests for infrastructure mappers (only 4 spec files in src/ total). User opted for smoke verification (Task 6) instead of inventing test scaffolding from scratch.
- [x] 7.2 ~~Add or update a unit test for `PurchaseOrderDataAccessMapper.toEntity`~~ — **SKIPPED** for the same reason as 7.1.
- [x] 7.3 ~~Add null-input test case~~ — **SKIPPED** for the same reason as 7.1.
- [x] 7.4 Run `pnpm run test` and confirm all suites pass — done; all 4 existing suites pass (22/22 tests). No regression from the entity/builder additions.

## 8. Wrap-up

- [x] 8.1 Self-review the diff: confirm the existing `total` / `sub_total` / `vat` computations and field values are untouched, no `// console.log` artifacts left over, and no other behavior changed beyond the additive fields and the projection-list extension.
- [ ] 8.2 Open the PR with a description that calls out (a) the item-LAK projection bug fix (item `rate` / `total_in_lak` / `vat_in_lak` were null in responses despite real DB values) and (b) the additive new header fields with their semantics (`*_in_lak` = sum of items' persisted LAK values, stable across rate changes; existing fields unchanged). Link the OpenSpec change folder.
