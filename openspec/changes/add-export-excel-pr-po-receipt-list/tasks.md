## 1. Shared export DTO base + ExcelExportService extensions

- [x] 1.1 In [src/common/utils/excel-export.service.ts](src/common/utils/excel-export.service.ts), add `exportPurchaseRequestListToExcel(rows: PrListExportRow[]): Promise<Buffer>` that writes header row `[PR Number, Created At, Requester]` and one row per item, using the existing Phetsarath OT styling helpers. Return the workbook buffer.
- [x] 1.2 Add `exportPurchaseOrderListToExcel(rows: PoListExportRow[]): Promise<Buffer>` that writes header row `[PO Number, Created At, Requester, Total]`. The Total cell MUST be a numeric value with thousands-separator number format applied at the cell-style level.
- [x] 1.3 Add `exportReceiptListToExcel(rows: ReceiptListExportRow[]): Promise<Buffer>` that writes header row `[Receipt Number, Created At, Requester, Total]`. The Total cell uses `_total` (LAK) as a numeric value.
- [x] 1.4 Define the three row-shape types (`PrListExportRow`, `PoListExportRow`, `ReceiptListExportRow`) co-located with the service or under `src/common/utils/types/`. Each shape contains plain primitives, no domain entities.
- [x] 1.5 Extend `generateFileName` (or add a small wrapper) so list exports produce filenames like `PR_list_<startYYYYMMDD>-<endYYYYMMDD>.xlsx` (and `PO_list_…`, `Receipt_list_…`).

## 2. Purchase Request export — backend wiring

- [x] 2.1 Create `ExportPurchaseRequestQueryDto` under [src/modules/manage/application/dto/query/](src/modules/manage/application/dto/query/) extending the existing `PurchaseRequestQueryDto` shape but with `startDate` and `endDate` marked `@IsDefined()` and a class-validator constraint asserting `endDate >= startDate`. Optional: enforce a max window length (e.g., 366 days).
- [x] 2.2 Create `GetAllPurchaseRequestForExportQuery` at `src/modules/manage/application/queries/purchaseRequest/get-all-for-export.query.ts` carrying the DTO and the auth user.
- [x] 2.3 In `src/modules/manage/infrastructure/repositories/purchaseRequest/read.repository.ts`, extract the existing where-clause + role-scoping logic from `findAll` into a private builder, then add a public `findAllForExport(filter, authUser)` that uses the same builder and skips `take`/`skip`. `findAll` continues to call the same builder so the two paths cannot drift.
- [x] 2.4 Add `GetAllPurchaseRequestForExportHandler` at `src/modules/manage/application/queries/purchaseRequest/handler/get-all-for-export.command.query.ts` implementing `IQueryHandler`. It calls `findAllForExport`, maps each row to `PrListExportRow` (`pr_number`, `createdAt`, `requesterUsername` from `document.users.username`, falling back to empty string when missing), and returns the array.
- [x] 2.5 Register the handler in `src/modules/manage/application/providers/purchaseRequest/index.ts` (`AllRegisterProviders`).
- [x] 2.6 In [src/modules/manage/controllers/purchase-request.controller.ts](src/modules/manage/controllers/purchase-request.controller.ts), add `GET /purchase-requests/export-excel` that: validates the DTO, executes the export query, calls `ExcelExportService.exportPurchaseRequestListToExcel`, builds the filename via `generateFileName`, sets `Content-Type` / `Content-Disposition` / `Content-Length`, and sends the buffer. Reuse the same auth/guard decorators as the existing `findAll`.
- [x] 2.7 Add Swagger `@ApiOperation` / `@ApiQuery` annotations matching the new DTO.

## 3. Purchase Order export — backend wiring

- [x] 3.1 Create `ExportPurchaseOrderQueryDto` extending the existing `PurchaseOrderQueryDto` with required `startDate`/`endDate` and the same range validators as PR.
- [x] 3.2 Create `GetAllPurchaseOrderForExportQuery` and the handler under `src/modules/manage/application/queries/purchaseOrder/`. The handler maps each PO row to `PoListExportRow` (`po_number`, `createdAt`, `requesterUsername`, `total`).
- [x] 3.3 In `src/modules/manage/infrastructure/repositories/purchaseOrder/read.repository.ts`, extract the where-clause builder and add `findAllForExport(filter, authUser)` mirroring step 2.3.
- [x] 3.4 Register the handler in `src/modules/manage/application/providers/purchaseOrder/index.ts`.
- [x] 3.5 In [src/modules/manage/controllers/purchase-order.controller.ts](src/modules/manage/controllers/purchase-order.controller.ts), add `GET /purchase-orders/export-excel` mirroring step 2.6 but calling `ExcelExportService.exportPurchaseOrderListToExcel`.
- [x] 3.6 Add Swagger annotations.

## 4. Receipt export — backend wiring

- [x] 4.1 Create `ExportReceiptQueryDto` extending the existing `ReceiptQueryDto`. The DTO MUST accept both `startDate`/`endDate` and the legacy `start_date`/`end_date` field names that already exist on the receipt list DTO; expose the canonical pair as required.
- [x] 4.2 Create `GetAllReceiptForExportQuery` and the handler under `src/modules/manage/application/queries/receipt/`. The handler maps each receipt to `ReceiptListExportRow` (`receipt_number`, `createdAt`, `requesterUsername`, `total` — using `_total` after the `convert-receipt-total-to-lak` change).
- [x] 4.3 Decide how to resolve `requesterUsername` for receipts (via `received_by` user lookup vs. document chain) and document the choice in the handler. Fall back to empty string when missing.
- [x] 4.4 In `src/modules/manage/infrastructure/repositories/receipt/read.repository.ts`, extract the where-clause builder and add `findAllForExport(filter, authUser)`.
- [x] 4.5 Register the handler in `src/modules/manage/application/providers/receipt/index.ts`.
- [x] 4.6 In [src/modules/manage/controllers/receipt.controller.ts](src/modules/manage/controllers/receipt.controller.ts), add `GET /receipts/export-excel` mirroring step 2.6 but calling `ExcelExportService.exportReceiptListToExcel`.
- [x] 4.7 Add Swagger annotations.

## 5. Validation, errors, observability

- [x] 5.1 Confirm the global `I18nValidationPipe` produces the standard validation error shape for missing/inverted date ranges on all three new endpoints. (Implemented via `@IsDefined() @Type(() => Date) @IsDate()` on `startDate`/`endDate` plus an explicit `endDate < startDate` guard in each controller that returns 400.)
- [x] 5.2 Verify role-scoping: a COMPANY_USER passing a `company_id` belonging to another company MUST still receive only their own company's rows. (Achieved by reusing each repo's existing `createBaseQuery`, which applies the `documents.company_id = :company_id` clause from the auth user's `CompanyUser` lookup before any client-supplied `company_id` filter.)
- [x] 5.3 Response sets `Content-Disposition: attachment; filename*=UTF-8''<encoded-name>` and `Content-Length` (mirrors the existing `/…/export/:id` pattern).

## 6. Tests — DEFERRED (lean implementation, per user)

- [ ] 6.1 Unit-test the where-clause builder extraction for each repository: identical SQL for the same filter input on both `findAll` and `findAllForExport`.
- [ ] 6.2 Unit-test each `ExcelExportService` list method: header row labels, column count, row count, requester-fallback (empty string when null), numeric `total` cell.
- [ ] 6.3 E2E test (under `test/`) for each endpoint: 200 with valid range, 400 on missing/inverted range, company scoping enforced for non-admin caller. Cover at least the happy path per spec.

## 7. Manual verification — DEFERRED to user (requires running dev server)

- [ ] 7.1 Run `pnpm run start:dev` and hit each export endpoint with a valid window via curl/Postman; open the resulting `.xlsx` in Excel and confirm columns, headers, and row counts match the corresponding `findAll`.
- [ ] 7.2 Check that the row set returned by `GET /<entity>` (paginated across all pages) equals the row set in the workbook for the same filters and caller.
- [ ] 7.3 Run `pnpm run lint` and `pnpm run test` before declaring the change ready for `/opsx:apply` follow-up.
