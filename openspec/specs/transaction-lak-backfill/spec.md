# transaction-lak-backfill Specification

## Purpose

Keep the source-document LAK valuations (`rate`, `total_in_lak`, `vat_in_lak`, `payment_total`) on PR items, PO items, and receipt items consistent with the budget-cut `DocumentTransaction.amount` written during receipt approval. Each time `insertDataInTransaction` records a `COMMIT` transaction, the linked source-document items are refreshed in the same database transaction using the same per-currency rates, so the ledger and the source documents agree by construction and reconciliation queries can verify correctness without re-deriving FX.

## Requirements

### Requirement: Approval-step DocumentTransaction insert SHALL refresh LAK fields on linked PR/PO/receipt items

When the receipt approval step writes a budget-cut `DocumentTransaction` (transaction_type = `COMMIT`) via `insertDataInTransaction` in `approve-step.command.handler.ts`, the system SHALL, in the same database transaction, refresh `rate` and the LAK-equivalent total on every PR item, PO item, and receipt item that contributes to that transaction. The per-item rate used for the refresh SHALL be the **same** rate used when computing `DocumentTransaction.amount`, sourced from the active row in `exchange_rates` whose `from_currency_id = item.currency_id` and `to_currency.code = 'LAK'` (i.e. the local `rateMap` that the handler already builds).

The refresh SHALL produce, for every contributing budget_item group, the following invariant:

> `DocumentTransaction.amount` = Σ over PO items in that group of (`po_item.total_in_lak` + `po_item.vat_in_lak`)

If any participant of the transaction (transaction insert, PR item update, PO item update, receipt item update) fails, the entire surrounding `runInTransaction` SHALL roll back.

#### Scenario: Single-currency receipt with one budget item

- **WHEN** `insertDataInTransaction` runs for a receipt whose PO items are priced in a single non-LAK currency C
- **AND** the active exchange rate C → LAK is R
- **THEN** every linked PO item SHALL be updated to `rate = R`, `total_in_lak = total * R`, `vat_in_lak = vat * R` (each rounded to 2 fractional digits)
- **AND** every linked PR item SHALL be updated to `rate = R`, `total_in_lak = total_price * R` (rounded to 2 fractional digits)
- **AND** every linked receipt item SHALL be updated to `rate = R` and `payment_total = (total + vat) * R` (rounded to 2 fractional digits)
- **AND** the inserted `DocumentTransaction.amount` SHALL equal the sum of those PO items' `total_in_lak + vat_in_lak`

#### Scenario: Mixed-currency PO covered by one receipt

- **WHEN** `insertDataInTransaction` runs for a receipt that contains PO items in two different currencies (e.g. USD and THB)
- **AND** active rates exist for USD → LAK and THB → LAK
- **THEN** each PO item SHALL be refreshed using the rate keyed by **its own** `currency_id` (no single receipt-wide rate)
- **AND** each PR item linked to those PO items SHALL be refreshed using the same per-item rate as its PO item
- **AND** each receipt item SHALL be refreshed using the rate of its own PO item's currency
- **AND** `DocumentTransaction.amount` SHALL be the sum of all per-item LAK totals (including VAT) within the budget_item group

#### Scenario: LAK-native receipt

- **WHEN** `insertDataInTransaction` runs for a receipt whose PO items are priced in LAK
- **THEN** linked PR items, PO items, and receipt items SHALL be updated to `rate = 1` and their LAK totals SHALL equal their native totals
- **AND** no exchange rate lookup is required for those items

#### Scenario: Active exchange rate missing for a non-LAK currency

- **WHEN** `insertDataInTransaction` encounters a non-LAK PO item currency for which the local `rateMap` has no entry
- **THEN** the handler SHALL throw `BadRequestException` with a message naming the missing currency (preserving current behaviour)
- **AND** no `DocumentTransaction` SHALL be persisted
- **AND** no PR item, PO item, or receipt item SHALL be left with partially updated `rate` or LAK fields

#### Scenario: Approval step rolls back after partial item refresh

- **WHEN** any failure occurs inside the approval-step transaction after PR/PO/receipt items have been updated (e.g. the `DocumentTransaction` write fails, a downstream validation throws)
- **THEN** the surrounding `runInTransaction` SHALL roll back
- **AND** PR items, PO items, and receipt items SHALL retain their pre-transaction values

#### Scenario: Idempotency when a DocumentTransaction already exists

- **WHEN** `insertDataInTransaction` runs for a `(document_id, budget_item_id)` group that **already** has a `DocumentTransaction`
- **THEN** the existing-transaction guard SHALL skip the budget-cut path for that group (current behaviour)
- **AND** PR/PO/receipt items belonging **only** to that already-skipped group SHALL NOT be re-updated
- **AND** PR/PO/receipt items that belong to other (still-pending) groups SHALL still be refreshed in the normal flow

### Requirement: Source-document and ledger LAK totals SHALL match by construction

After `insertDataInTransaction` commits, for every `(document_id, budget_item_id)` group it processed, the SQL invariant below SHALL hold:

> `DocumentTransaction.amount` = Σ `purchase_order_items.total_in_lak` + Σ `purchase_order_items.vat_in_lak`
> for the PO items linked (via receipt_items) to that group.

This is the externally-checkable form of the per-row refresh requirement above and exists so reconciliation queries can verify ledger correctness without re-deriving FX.

#### Scenario: Reconciliation query

- **WHEN** an operator joins `document_transactions` to `receipt_items` → `purchase_order_items` for a given approved receipt
- **THEN** `DocumentTransaction.amount` SHALL equal the summed `total_in_lak + vat_in_lak` of those PO items, within rounding precision (≤ 0.01 LAK per group)
