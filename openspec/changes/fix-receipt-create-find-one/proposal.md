## Why

`POST /api/receipts` returns 500 with `Could not find any entity of type "ReceiptOrmEntity" matching: { "id": "108" }` even though the receipt was just inserted in the same transaction. The root cause is that the create handler ends by re-fetching the new receipt through `ReadReceiptRepository.findOne`, which reuses `createBaseQuery` — a heavy listing query built from `innerJoin`s on currency, payment_currency, selected vendors, units, and document_statuses. When any of those relations is missing for the freshly created rows (e.g. `receipt_items.currency_id` falls back to `0`, or `purchase_order_items.budget_item.budget_accounts.currency_id` is null), the inner joins eliminate the receipt and `getOneOrFail()` raises with the receipt's real id, masking what is really a "missing related row" problem. Receipts cannot be created in production today.

## What Changes

- Replace `ReadReceiptRepository.findOne`'s use of the heavy `createBaseQuery` with a query that does not filter the receipt out when optional relations are missing — convert the brittle `innerJoin`s on currency, payment currency, selected vendors, vendor bank account, units, document_statuses, and document_approvers into `leftJoin`s for the single-record fetch, while keeping the listing query untouched.
- Harden `CreateCommandHandler.saveItem` so that `receipt_items.currency_id` and `payment_currency_id` are never persisted as `0`/`null` — when the source `purchase_order_item.currency_id` or `budget_item.budget_accounts.currency_id` cannot be resolved, throw `ManageDomainException('errors.not_found', BAD_REQUEST, { property: 'currency' / 'payment currency' })` instead of silently writing `?? 0`.
- Improve the post-create read failure mode: when `findOne` cannot locate the just-created receipt, return a domain exception that clearly identifies which related row is missing (currency, vendor bank account, document approver) instead of a raw TypeORM `EntityNotFoundError` with HTTP 500.
- Add a regression test (unit or e2e) that creates a receipt against a PO whose item has a valid currency and budget account currency, and asserts the response is the newly created receipt — guarding both the data validation and the read-back path.

## Capabilities

### New Capabilities
- `receipt-create`: behavior contract for `POST /api/receipts` — preconditions on PO/PR/document-type/approval workflow, currency resolution rules for receipt items, transactional persistence of receipt + items + user_approval + step + document_approver, and the response contract (must return the freshly created receipt without 500 when the inputs are valid).

### Modified Capabilities
<!-- none — no existing specs in openspec/specs/ -->

## Impact

- Code:
  - [src/modules/manage/infrastructure/repositories/receipt/read.repository.ts](src/modules/manage/infrastructure/repositories/receipt/read.repository.ts) — `findOne` (and likely a new dedicated single-record query helper).
  - [src/modules/manage/application/commands/receipt/handler/create.command.handler.ts](src/modules/manage/application/commands/receipt/handler/create.command.handler.ts) — `saveItem` currency resolution, plus the final `_readRepo.findOne(...)` call site.
- API: `POST /api/receipts` stops returning 500 on the happy path. Error responses become 400/404 with the offending property when source data is incomplete, instead of a generic TypeORM 500.
- Data: no schema changes; no migration required. Existing receipt rows with `currency_id = 0` (if any) will need a one-time data audit but are out of scope for this change.
- Dependencies: none added.
- Other consumers of `ReadReceiptRepository.findOne` (e.g. `getOne`, `getByToken`, `getPrint` indirectly, `exportToExcel`) benefit from the same leftJoin relaxation — verify their existing assertions still hold.
