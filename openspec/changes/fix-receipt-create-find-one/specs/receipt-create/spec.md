## ADDED Requirements

### Requirement: Receipt creation returns the created receipt without 500

`POST /api/receipts` SHALL persist a new receipt and respond with the hydrated receipt body when the request payload is valid and all referenced rows exist (purchase order, document type, approval workflow, currency on each PO item, budget account currency, selected vendor and bank account). The response MUST NOT depend on whether optional related data (e.g. document attachments, quota company, vendor product, banks) is populated.

#### Scenario: Happy-path creation against a fully-populated PO

- **WHEN** an authenticated user POSTs a valid `CreateReceiptDto` referencing a `purchase_order_id` whose items each have a `currency_id`, a `budget_item.budget_accounts.currency_id`, an active `exchange_rate` between those currencies, a `purchase_order_selected_vendors` row, and a `vendor_bank_account`
- **THEN** the API responds 200 and the body contains the newly created receipt with the generated `id`, the generated `receipt_number`, the matching `purchase_order_id`, and the persisted `receipt_items` mirroring the PO items

#### Scenario: Missing optional relations do not block read-back

- **WHEN** the just-created receipt has no `document_attachments`, no `quota_company`, no `vendor_product`, or no bank metadata
- **THEN** the API still responds 200 with the receipt; the missing relations appear as `null` in the response, not as a 500

### Requirement: Receipt items SHALL persist a non-zero currency

The system SHALL refuse to persist a `receipt_items` row whose `currency_id` or `payment_currency_id` would be `0` or null. The currency MUST come from the source `purchase_order_item.currency_id` and the payment currency MUST come from the source `purchase_order_item.budget_item.budget_accounts.currency_id`.

#### Scenario: PO item missing currency_id

- **WHEN** the request references a `purchase_order_item` whose `currency_id` is null
- **THEN** the API responds 400 with `errors.not_found` and `property: "currency"` and no receipt or receipt_items rows are persisted (the transaction rolls back)

#### Scenario: PO item missing budget account currency

- **WHEN** the request references a `purchase_order_item` whose `budget_item.budget_accounts.currency_id` is null
- **THEN** the API responds 400 with `errors.not_found` and `property: "payment currency"` and no receipt or receipt_items rows are persisted

### Requirement: Read-back failures SHALL produce an actionable domain error

When the create handler successfully commits the receipt but the post-commit `findOne` cannot locate it, the API MUST respond with a domain exception that names the receipt and a stable error key — not a raw TypeORM `EntityNotFoundError` message.

#### Scenario: Read-back miss surfaces a domain error

- **WHEN** the receipt has been inserted but the read-back query returns no row
- **THEN** the API responds with a `ManageDomainException` carrying a stable i18n key (e.g. `errors.receipt_create_read_back_failed`) and the property `"receipt"` — the response message MUST NOT be the literal string `Could not find any entity of type "ReceiptOrmEntity" matching: { "id": "<n>" }`

### Requirement: Listing and export endpoints SHALL keep their current filtering behavior

The fix for the single-record read-back MUST NOT change the join semantics of `GET /api/receipts` (list) or the Excel export endpoint. Filters that depend on inner joins (e.g. `payment_type` filtering on `receipt_items`) continue to work identically.

#### Scenario: List endpoint still filters by payment_type

- **WHEN** a client calls `GET /api/receipts?payment_type=<value>` after the fix
- **THEN** the list returns only receipts whose `receipt_items.payment_type` matches the filter, exactly as before the fix

#### Scenario: List endpoint still scopes by company for COMPANY_ADMIN/COMPANY_USER

- **WHEN** a `COMPANY_USER` calls `GET /api/receipts`
- **THEN** the list returns only receipts whose `documents.company_id` matches the caller's company, exactly as before the fix

### Requirement: A regression test SHALL pin the create-then-read-back path

The repository SHALL contain an automated test that drives `ReceiptService.create` (or `POST /api/receipts` end-to-end) against a valid fixture and asserts the response is the freshly created receipt. The test MUST fail if the read-back path regresses to the pre-fix behavior of throwing `Could not find any entity of type "ReceiptOrmEntity"`.

#### Scenario: Regression test catches the read-back failure

- **WHEN** the read-back query is reverted to use the listing-shape inner-join query
- **THEN** the regression test fails with a clear assertion (not a flaky timeout) so the regression is caught in CI before merge
