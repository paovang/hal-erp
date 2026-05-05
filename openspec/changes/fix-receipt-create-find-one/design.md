## Context

`POST /api/receipts` currently fails with HTTP 500 in production:

```
{
  "statusCode": 500,
  "path": "/api/receipts",
  "method": "POST",
  "message": "Could not find any entity of type \"ReceiptOrmEntity\" matching: { \"id\": \"108\" }"
}
```

The failure happens **after** the receipt has been inserted (id `108` is the row TypeORM just generated). Tracing the create flow in [src/modules/manage/application/commands/receipt/handler/create.command.handler.ts](src/modules/manage/application/commands/receipt/handler/create.command.handler.ts):

1. `WriteReceiptRepository.create` saves the receipt → returns id 108.
2. `saveItem` writes one `receipt_items` row per `purchase_order_item`. For each item it copies:
   - `currency_id: purchase_order_item?.currency_id ?? 0`
   - `payment_currency_id: purchase_order_item?.budget_item?.budget_accounts?.currency_id ?? 0`
   The `?? 0` fallback can persist `0` if the source is missing.
3. user_approval, user_approval_step, document_approver are created.
4. The handler returns `await this._readRepo.findOne(new ReceiptId(receipt_id), manager)`.

`ReadReceiptRepository.findOne` (read.repository.ts:840) reuses `createBaseQuery`, which is the listing query and uses **inner joins** on:
- `receipts.receipt_items`, `receipt_items.currency`, `receipt_items.payment_currency`
- `purchase_order_items.purchase_order_selected_vendors`, `selected_vendors`
- `purchase_request_items.units`
- `documents.user_approvals.document_statuses`, `user_approval_steps.document_approvers`

Any one of those joins returning zero rows for the new receipt drops the receipt from the result set, and `getOneOrFail()` throws the misleading "matching: { id: 108 }" error. The most likely failing join in production today is `receipt_items.currency` / `payment_currency` because of the `?? 0` fallback, but `purchase_order_selected_vendors`, `vendor_bank_account` (left join already), and `document_statuses` are also brittle for a freshly-created row.

Stakeholders:
- Backend (manage module owners) — owns this fix.
- Mobile/Frontend — currently blocked from creating any receipt.
- QA — needs the regression test before sign-off.

## Goals / Non-Goals

**Goals:**
- `POST /api/receipts` returns 200 with the new receipt body when inputs are valid.
- When source data prevents creation (missing currency, missing vendor bank account, no approval workflow, etc.) the API returns a 4xx with an actionable `errors.*` key — never a TypeORM 500.
- The fix does not regress the existing list (`GET /api/receipts`) or print/export endpoints that share `createBaseQuery`.
- A regression test pins the happy path so this exact 500 cannot return.

**Non-Goals:**
- Refactoring the entire receipt module (mappers, dto layout, code style).
- Cleaning up the commented-out currency conversion block in `saveItem`.
- Adding new receipt features, fields, or endpoints.
- Backfilling/cleaning historical receipt rows that already have `currency_id = 0` — flagged for a separate data audit.
- Splitting the listing query — the listing path keeps its current shape; only the single-record fetch changes.

## Decisions

### Decision 1: Use a dedicated, leftJoin-based query for `findOne` instead of reusing `createBaseQuery`

**Choice:** Add a separate query (e.g. `createSingleRecordQuery`) inside `ReadReceiptRepository` that mirrors the relations needed for the response DTO but uses `leftJoin` everywhere a row may legitimately be missing for a freshly-created receipt: currency, payment_currency, purchase_order_selected_vendors, vendor_bank_account, banks, units, document_statuses, user_approval_steps, document_approvers, quota_company, vendors, products. `findOne` (and `getPrint`) use this new query. `findAll` / `findAllForExport` keep using `createBaseQuery` unchanged.

**Alternatives considered:**
- *Convert all `innerJoin`s in `createBaseQuery` to `leftJoin`s.* Rejected: list filtering relies on those joins being inner (e.g., `receipt_items.payment_type` filter). Changing them would change list semantics.
- *Re-fetch via `manager.findOne(ReceiptOrmEntity, { where: { id }, relations: [...] })`.* Possible, but the response mapper expects the same join shape used in `createBaseQuery`; using TypeORM's `relations` would force changes in `ReceiptDataAccessMapper.toEntity`. The dedicated QueryBuilder is the smallest diff.
- *Skip the read-back and build the response from in-memory entities.* Rejected: the mapper depends on related rows (department, document_type, approver signature, etc.) that aren't loaded into the entities the handler holds.

**Why:** smallest blast radius, isolates the fix to the single-record path, and keeps mapper expectations intact.

### Decision 2: Fail fast in `saveItem` when currency cannot be resolved

**Choice:** Replace `currency_id: purchase_order_item?.currency_id ?? 0` and `payment_currency_id: purchase_order_item?.budget_item?.budget_accounts?.currency_id ?? 0` with explicit assertions. If either is null/undefined, throw `ManageDomainException('errors.not_found', BAD_REQUEST, { property: 'currency' | 'payment currency' })` so the API returns 400 instead of inserting a `0` and failing later.

**Alternatives considered:**
- *Leave the `?? 0` and only fix the read query.* Rejected: writing `0` into `receipt_items.currency_id` corrupts data even after the read is fixed (downstream reports, exports, prints break).
- *Resolve a default currency.* Rejected: there is no domain notion of a "default" currency for a receipt; the right currency is the PO item's currency. If absent, the upstream PO is broken and we should signal that, not paper over it.

**Why:** prevents bad rows at the source, gives the client a clear error, and stops silent data corruption.

### Decision 3: Translate read-back miss into a domain exception with a useful message

**Choice:** Wrap the final `_readRepo.findOne(...)` call so that a TypeORM `EntityNotFoundError` is converted into `ManageDomainException('errors.receipt_create_read_back_failed', INTERNAL_SERVER_ERROR, { property: 'receipt' })` (or similar i18n key). The transaction will already have committed by then; we want the operator to see "the receipt was created but cannot be read back" rather than the raw TypeORM error.

**Alternatives considered:**
- *Move the `findOne` inside the same transactional read or skip read-back.* Rejected: the team has chosen to return the full hydrated DTO from create; that contract is callers' expectation.
- *Throw a generic 500 unchanged.* Rejected: this is exactly the bug we're fixing — the message must explain what failed.

**Why:** observability for the next time a relation is unexpectedly missing.

### Decision 4: Test scope — one e2e + one unit test

**Choice:**
- One Jest unit test on `CreateCommandHandler.saveItem` (or its extracted helper) verifying that a missing PO-item currency throws the new `ManageDomainException` instead of writing `0`.
- One Jest e2e or service-level test that drives `ReceiptService.create` with a valid PO, asserts the returned receipt has the right id, and asserts a subsequent `findOne` returns the same row.

**Alternatives considered:** broader test coverage of every `findOne` consumer. Out of scope per Non-Goals.

## Risks / Trade-offs

- **Risk:** the new leftJoin-based single-record query returns rows with null relations that the mapper does not expect, causing a different runtime error in `ReceiptDataAccessMapper.toEntity` (NPE).
  → **Mitigation:** before shipping, audit `ReceiptDataAccessMapper.toEntity` (and the mapper for purchase_order/purchase_request used by `getPrint`) for required relations and add null guards or explicit assertions where domain rules demand the relation must exist.

- **Risk:** the stricter validation in `saveItem` regresses a user flow that *currently* succeeds because the `0`-fallback row passes some unrelated read path.
  → **Mitigation:** grep for usages of `receipt_items.currency_id = 0` / `payment_currency_id = 0`. Confirm no existing report or export depends on that sentinel; if any, surface that in the migration plan.

- **Risk:** legacy receipt rows already in the DB with `currency_id = 0` will start failing reads if the read query becomes stricter elsewhere.
  → **Mitigation:** the read change is leftJoin only — strictly more permissive — so legacy rows continue to read. The write-side validation only affects new rows.

- **Trade-off:** duplicating part of `createBaseQuery` into a new `createSingleRecordQuery` increases maintenance surface (two queries to update when joins change).
  → **Mitigation:** factor the shared `selectFields` and join scaffolding into private helpers so the diff between the two queries is just inner-vs-left and the additional list-only filters.

## Migration Plan

1. Land the read-side fix (Decision 1) and the write-side validation (Decision 2) together in a single PR.
2. Manually verify against the production-like dataset by retrying the failing payload that produced id 108.
3. Deploy. No DB migration required.
4. **Rollback:** revert the PR — no schema or data changes to undo.

## Open Questions

- Does any existing receipt row have `currency_id = 0` or `payment_currency_id = 0`? (Run a SELECT before deploy; if yes, decide whether to backfill before tightening the write path or just accept the legacy rows since the write guard only affects future writes.)
- Should `getPrint` use the new single-record query or keep the listing-shape query? (Defaulting to the new single-record query in this change; revisit if the print template depends on a relation we make optional.)
