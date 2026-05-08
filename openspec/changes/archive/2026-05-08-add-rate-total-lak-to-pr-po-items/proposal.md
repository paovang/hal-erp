## Why

Purchase Request (PR) and Purchase Order (PO) items are stored in their original currency only (`price`, `total`, `currency_id`), with no LAK-equivalent recorded at save time. Reporting and budget reconciliation against a LAK-denominated budget therefore depend on re-deriving FX values on the fly, which is fragile when exchange rates change between PR creation, PO issue, and goods receipt. We need to persist `rate` and `total_in_lak` on each PR/PO item so the LAK amount used for budget cuts is auditable, and we need the receipt step (which is the authoritative budget-cut moment) to back-update those fields with the rate that was actually applied.

## What Changes

- Add `rate` and `total_in_lak` fields to the **Purchase Request item** domain entity, ORM entity, builder, mapper, response DTO, and create/update handlers.
- Add `rate`, `total_in_lak`, and `vat_in_lak` fields to the **Purchase Order item** domain entity, ORM entity, builder, mapper, response DTO, and create/update handlers.
- On PR/PO **save** (create or update): if currency is LAK, store `rate = 1` and `total_in_lak = total`. If non-LAK, look up the active exchange rate for the item's currency → LAK and persist `rate` plus the converted `total_in_lak` (and `vat_in_lak` for PO).
- On **`DocumentTransaction` insertion during the receipt approval step** (the actual budget-cut moment, in `approve-step.command.handler.ts → insertDataInTransaction`): use the same rate that drives `DocumentTransaction.amount` to back-update the linked PR items, PO items, and receipt items so every source document and the budget ledger agree on the LAK figure. Receipt items already have `rate` and `payment_total` columns; only the PR/PO items need new columns.
- Adopt the prepared migration `1778215680596-update-schema.ts` (already adds the columns and backfills via `exchange_rates`) as the schema source of truth — no new migration required.
- **BREAKING (response shape only):** PR-item and PO-item response DTOs gain `rate` and `total_in_lak` (plus `vat_in_lak` on PO). Existing fields are unchanged.

## Capabilities

### New Capabilities

- `pr-item-lak-valuation`: Persist and expose the LAK-equivalent valuation (`rate`, `total_in_lak`) on every Purchase Request item, set at PR save and refreshed at receipt time.
- `po-item-lak-valuation`: Persist and expose the LAK-equivalent valuation (`rate`, `total_in_lak`, `vat_in_lak`) on every Purchase Order item, set at PO save and refreshed at receipt time.
- `transaction-lak-backfill`: When the receipt approval step inserts a budget-cut `DocumentTransaction` (`insertDataInTransaction`), refresh `rate` and the LAK-equivalent total on the linked PR items, PO items, and receipt items using **the same per-item rate that produces `DocumentTransaction.amount`**, so the source documents and the budget ledger always agree.

### Modified Capabilities

<!-- None. The existing excel-export specs do not currently constrain item LAK fields; they may consume the new fields later but that is not required by this change. -->

## Impact

- **Domain**: `purchase-request-item.entity.ts`, `purchase-order-item.entity.ts` and their builders gain new fields and setters.
- **Infrastructure**: `purchase-request-item.orm.ts` and `purchase-order-item.orm.ts` gain `@Column` definitions matching the existing migration (`rate` decimal(15,8), `total_in_lak` decimal(18,2), `vat_in_lak` decimal(18,2)).
- **Mappers**: PR-item and PO-item mappers (toEntity / toOrmEntity) extended.
- **Application**:
  - PR create/update handlers (`commands/purchaseRequest/handler/*`) resolve rate via `IReadExchangeRateRepository` and write LAK fields at save time.
  - PO create/update handlers (`commands/purchaseOrder/handler/*`) do the same plus VAT-in-LAK.
  - Approve-step handler (`commands/userApprovalStep/handler/approve-step.command.handler.ts`), specifically the existing private method `insertDataInTransaction`, refreshes PR-item, PO-item, and receipt-item LAK fields in the same transaction that writes the `COMMIT` `DocumentTransaction`. The rate used is the one already loaded into the local `rateMap` (active rates → LAK).
  - The receipt-create handler (`commands/receipt/handler/create.command.handler.ts`) is **not** modified by this change — the budget cut happens at approval time, not at receipt creation.
- **API responses**: `purchase-request-item.response.ts` and `purchase-order-item.response.ts` include the new fields.
- **Database**: existing migration `1778215680596-update-schema.ts` adds the columns and backfills historical rows; no new migration.
- **Dependencies**: `IReadExchangeRateRepository` (already used by receipt handler) becomes a dependency of PR and PO command handlers as well.
- **Out of scope**: changing how budget records are decremented, multi-leg currency conversion, historical revaluation of already-receipted items, and UI/excel export changes.
