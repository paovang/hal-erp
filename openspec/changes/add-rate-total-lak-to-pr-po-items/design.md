## Context

The `purchase_request_items` and `purchase_order_items` tables today record amounts only in the item's native currency (`price`/`total_price`, `total`/`vat`). The system's budget is denominated in LAK. Conversion happens at multiple steps but the LAK figure is not persisted on the source documents, so:

- Reports and excel exports cannot show a stable LAK valuation per item.
- If the exchange rate moves between PR creation, PO issuance, receipt entry, and account approval, there is no audit record of which rate actually cut the budget.
- Excel-export specs already exist for PR/PO/receipt lists, so any LAK column added later needs consistent source-of-truth fields.

**Where the budget cut actually happens (key correction).** The budget is decremented when an account-admin/account-user approves the receipt step, inside `approve-step.command.handler.ts → insertDataInTransaction` (lines ~1218–1420). That method:

1. Builds a `rateMap` from active rows in `exchange_rates` where `to_currency.code = 'LAK'`, keyed by `from_currency_id` (lines 1235–1244).
2. Groups receipt items by `purchase_order_items.budget_item_id`.
3. For each group, sums `Σ (po_item.total + po_item.vat) * rateMap[po_item.currency_id]` into `sum_total` (lines 1331–1359).
4. Persists a `DocumentTransaction` with `amount = sum_total` and `transaction_type = COMMIT` (lines 1408–1418).

The receipt **create** handler (`commands/receipt/handler/create.command.handler.ts`) does not cut the budget — it only stores the receipt. So the back-update of PR/PO/receipt items must happen in `insertDataInTransaction`, not at receipt-create time.

A migration `1778215680596-update-schema.ts` already exists adding `rate decimal(15,8)`, `total_in_lak decimal(18,2)` to PR items, and `rate decimal(15,8)`, `total_in_lak decimal(18,2)`, `vat_in_lak decimal(18,2)` to PO items, with a backfill that joins `exchange_rates` for historical rows. Receipt items already have `rate` (decimal 15,8) and `payment_total` (decimal 18,2) — equivalent to `rate`/`total_in_lak` for receipts; **no schema change is needed for receipt items**. Domain entities, ORM entities, builders, mappers, DTOs, and command handlers have not been wired up to use the new PR/PO columns yet. This change wires those up and adds the back-update step in `insertDataInTransaction`.

## Goals / Non-Goals

**Goals:**

- Persist `rate` and `total_in_lak` (and `vat_in_lak` for PO) on every PR/PO item from the moment the document is saved.
- During the receipt approval step's `insertDataInTransaction`, write the rate that drives `DocumentTransaction.amount` back onto every linked PR item, PO item, and receipt item so the source documents and the budget ledger always agree on the FX value used.
- Expose the new fields in PR-item and PO-item response DTOs.
- Reuse the existing `IReadExchangeRateRepository` and the prepared migration — no new schema, no new repository.

**Non-Goals:**

- Changing how budgets are decremented or how PR/PO/receipt totals are computed in native currency.
- Multi-leg currency conversion (e.g. THB → USD → LAK). All conversions are direct currency → LAK.
- Historical revaluation of items belonging to already-committed `DocumentTransaction`s beyond what the migration's backfill does.
- Modifying the receipt-create handler. The budget cut and the back-update both belong to the approval-step flow, not to receipt creation.
- Adding new columns to receipt items — they already have `rate` and `payment_total`.
- UI/report/excel-export changes. Adding LAK columns to exports is a separate change that consumes these fields.
- Adding `rate`/`total_in_lak` to write DTOs. Clients SHALL NOT supply these — they are computed server-side.

## Decisions

### 1. Where the FX lookup happens

**Decision:** Lift the rate lookup into a small reusable helper (e.g. `resolveLakValuation(currencyId, amount)` co-located in the manage application services or a dedicated `currency-conversion.service.ts`), backed by `IReadExchangeRateRepository`. The PR create/update handlers and the PO create/update handlers call this helper at save time. The approve-step handler (`insertDataInTransaction`) **does not** call this helper — it already builds its own `rateMap` from `ExchangeRateOrmEntity` and uses it to compute `DocumentTransaction.amount`. Reuse that `rateMap` directly when back-updating PR/PO/receipt items so the rate cannot diverge from the rate baked into the transaction amount.

**Why:** Two different save-time call sites (PR, PO) need the same logic (currency=LAK short-circuit, lookup-and-fail-if-missing, multiply-and-round). Inlining it twice invites drift; a handler-level utility keeps the policy in one place. The approval-step path is different — it already has a loaded rate map and uses it for the authoritative ledger amount. Forcing it through the helper would either duplicate the lookup or risk a different code path producing a different rate, breaking the invariant `amount = Σ total_in_lak`.

**Alternative considered:** Have the helper accept a preloaded rate map and use it everywhere. Rejected — the helper would grow a second mode and the value of "single source of truth for FX" is small compared to the simpler "use the rateMap that already drives the ledger."

### 2. Rounding convention

**Decision:** Round LAK amounts to 2 fractional digits using the same rounding the migration's backfill uses (`ROUND(... , 2)` SQL semantics — banker's rounding is **not** required; `Math.round` after multiplying by 100 / dividing is acceptable as long as it agrees with the migration).

**Why:** Avoids drift between values produced by the migration's backfill and values produced by application code on subsequent updates. The DB column is `decimal(18,2)` so the value is canonicalized at storage anyway.

**Risk:** floating-point accumulation in JS. Mitigation: do the multiply in number space, round to 2 dp, write as string to TypeORM decimal columns (TypeORM already handles decimal as string).

### 3. When to refresh on update vs. recompute on every save

**Decision:** Always recompute `rate`, `total_in_lak` (and `vat_in_lak`) on every create and every update where any of `price`, `quantity`, `total`, `vat_total`, or `currency_id` could have changed. Don't try to detect "the rate didn't change, skip it" — call the helper unconditionally; LAK short-circuits cheaply.

**Why:** Simplicity; the cost is one read per PR/PO save. Avoids stale LAK values when callers update partial fields.

### 4. Approval-step refresh: which rate wins, and the invariant it enforces

**Decision:** Inside `insertDataInTransaction`, after the existing `rateMap` is built and **before** the `DocumentTransaction` is persisted, iterate the items in each `(document_id, budget_item_id)` group and write back, **using the same `rateMap[po_item.currency_id]`** that contributes to `sum_total`:

- For each PO item in the group: set `rate = R`, `total_in_lak = total * R`, `vat_in_lak = vat * R`.
- For the PR item linked to that PO item (1:1 via `purchase_order_items.purchase_request_items` relation): set `rate = R`, `total_in_lak = total_price * R`.
- For the receipt item that triggered the group: set `rate = R`, `payment_total = (total + vat) * R`.

Then persist `DocumentTransaction.amount = sum_total`. By construction, `sum_total` is `Σ (total_in_lak + vat_in_lak)` over the group's PO items, so the invariant `amount = Σ total_in_lak + Σ vat_in_lak` holds.

**Why:** This is what the user asked for — `rate` ของ PR/PO/receipt ต้องตรงกับ `DocumentTransaction.amount` ที่ถูก save ไป. Computing the writes from the same `rateMap` lookup that feeds `sum_total` is the only way to guarantee the figures cannot drift.

**Alternative considered:** Compute `total_in_lak` once per item and let `sum_total = Σ total_in_lak + Σ vat_in_lak` use the persisted column values. Rejected only because it changes the existing arithmetic in `insertDataInTransaction`; the simpler patch is to keep the existing summation and add three `manager.update(...)` calls inside the same loop. Either ordering produces identical numbers — the invariant is preserved either way.

**Alternative considered:** Defer the back-update to a post-commit task. Rejected — splits the transaction boundary and breaks atomicity.

### 5. Missing exchange rate handling

**Decision:** If a non-LAK currency has no active row in `exchange_rates`, the create/update command fails with a domain exception (e.g. `ExchangeRateNotFoundException`) and rolls back. No partial save, no fallback to `1`.

**Why:** Silently saving with `rate=1` for a non-LAK currency would corrupt the budget reconciliation. Loud failure is correct.

### 6. Transactionality

**Decision:** Reuse the existing `EntityManager` already passed into `insertDataInTransaction` by `runInTransaction`. The PR/PO/receipt-item refreshes are additional `manager.update(...)` calls inside the existing approval-step transaction. They must execute **before** `this._writeTransaction.create(...)` so a failed item-update aborts the `DocumentTransaction` write and the surrounding step approval.

**Why:** No new transaction boundary; preserves the all-or-nothing guarantee the approval-step flow already has. Failure in any leg rolls everything back, satisfying the spec's "no partial update" scenario.

### 7. ORM ↔ Domain mapping

**Decision:** Add `rate` and `total_in_lak` (and `vat_in_lak`) to:
- ORM entities with `@Column({ type: 'decimal', precision: 15, scale: 8, transformer: <number-string> })` for `rate` and `precision: 18, scale: 2` for the LAK fields, matching the migration exactly.
- Builders with new `withRate`/`withTotalInLak`/`withVatInLak` setters.
- `toEntity` / `toOrmEntity` mappers: read both directions.
- Response DTOs as exposed numeric fields.

The write DTOs (create/update) **do not** receive these — they are derived server-side.

## Risks / Trade-offs

- **Risk:** Active exchange rate rows have time-bounded validity that doesn't match the date a PR/PO was saved (`exchange_rates` lookup returns "current" when a historically-correct row is wanted). → **Mitigation:** scope is "active rate at save time" and "active rate at approval time"; no historical-rate semantics. Documented as non-goal.

- **Risk:** PR/PO items in a single receipt may span multiple currencies. → **Mitigation:** the back-update in `insertDataInTransaction` keys `rateMap` by **each item's** `currency_id` (already the case for `sum_total` computation). Tests must cover mixed-currency PO/receipts.

- **Trade-off:** Always recomputing on PR/PO update means if an admin updates an unrelated field, the LAK values can move (because the active rate changed since last save). Acceptable — the approval-step refresh in Decision 4 will overwrite them anyway when the budget is cut.

- **Risk:** Existing `insertDataInTransaction` has an idempotency guard (`exists(...)` check skips groups that already have a `DocumentTransaction`). Adding the refresh after that guard preserves idempotency: re-running on an already-cut group will not re-touch its items. → **Mitigation:** the spec explicitly covers this with a scenario; behaviour is preserved, not changed.

- **Risk:** Excel exports and existing PR/PO list responses may have downstream consumers that don't expect new fields. → **Mitigation:** new fields are additive; no removals or renames. Note in PR description that response DTOs grew.

- **Risk:** TypeORM decimal columns return strings; arithmetic in JS without parsing produces `"100" * 1.5 = 150` (works) but `"100.50" + "50.25" = "100.5050.25"` (broken). → **Mitigation:** the existing handler already calls `Number(...)` before multiplying (lines 1342–1357); follow the same pattern for the writes, converting the rounded result back to a 2-dp string for persistence.

- **Risk:** Rounding `total_in_lak` per-item then summing for `DocumentTransaction.amount` can drift by ≤ 0.01 × N from `Math.round(Σ total * rate, 2)`. → **Mitigation:** define `sum_total = Σ round(total_in_lak, 2) + Σ round(vat_in_lak, 2)` so the invariant holds *exactly* by construction. The existing code computes `sum_total` from unrounded products, so this requires a small reorder: round per item first, then sum.

## Migration Plan

1. **Schema:** the migration `1778215680596-update-schema.ts` is already in `src/common/infrastructure/database/migrations/`. Run `pnpm run migration:run` in any environment that has not yet picked it up. The backfill in the migration handles existing rows.
2. **Code:** ship the entity / ORM / builder / mapper / DTO / handler updates together. They are coupled — half-shipping causes either compile errors or `null`-write failures (NOT NULL columns).
3. **Verify:** smoke-test create/update PR, create/update PO, create receipt covering both LAK and non-LAK items.
4. **Rollback:** the migration's `down()` drops the columns. To roll the application code back to the pre-change state, revert the application commits **before** running the down migration (otherwise the entity/ORM expects columns that were just dropped).

## Open Questions

- Q: Should the exchange-rate helper accept an effective date (so we could later swap "active rate" for "rate as of receipt date" without an interface change)? → Defer; current spec does not require it.
- Q: When a receipt only partially fulfils a PO line (e.g. ordered 10, received 4), do we still overwrite the **whole** PO item's rate/LAK fields, or only proportionally? → **Decision:** overwrite the whole PO item's `rate` and recompute `total_in_lak` from the PO item's stored `total` (not the received quantity). The PO item's "total in LAK" remains its full LAK value at the rate of the most recent approval. Confirm with stakeholders before implementation if this contradicts existing reporting expectations.
- Q: After a `DocumentTransaction` already exists for a `(document_id, budget_item_id)` group and a later PO update changes the native-currency `total`, the persisted `total_in_lak` would drift from the ledger. Do we forbid such updates, recompute and emit an adjustment transaction, or accept the drift? → **Decision for now:** accept the drift; PO updates after budget commit are out of scope for this change. Document as a known limitation.
