## 1. Row interfaces and shared Excel service

- [x] 1.1 In `src/common/utils/excel-export.service.ts`, extend `PrListExportRow`, `PoListExportRow` and `ReceiptListExportRow` to add `status: string` and `createdBy: string`, and reorder fields to match the new column layout (`number, requesterUsername, status, createdBy, createdAt[, total]`).
- [x] 1.2 Rewrite `exportPurchaseRequestListToExcel` so the worksheet has columns `PR Number`, `Username`, `Status`, `Created By`, `Created At` in this order; map `requesterUsername` to the `Username` column; apply existing header / body styling and per-cell alignment per the spec.
- [x] 1.3 Rewrite `exportPurchaseOrderListToExcel` so the worksheet has columns `PO Number`, `Username`, `Status`, `Created By`, `Created At`, `Total` in this order, with `#,##0.00` number format and right alignment on `Total`.
- [x] 1.4 Rewrite `exportReceiptListToExcel` so the worksheet has columns `Receipt Number`, `Username`, `Status`, `Created By`, `Created At`, `Total` in this order, with `#,##0.00` number format and right alignment on `Total`.
- [x] 1.5 Add a private helper `appendSumTotalRow(worksheet, totalColumnLetter, lastDataRow)` that writes the bold `Sum Total` label in column A, leaves columns B–E empty (still bordered), and writes a `SUM(<col>2:<col><lastDataRow>)` formula with `#,##0.00` formatting in the total column. Skip when there are no data rows.
- [x] 1.6 Call the helper from both `exportPurchaseOrderListToExcel` and `exportReceiptListToExcel`. Do NOT call it from `exportPurchaseRequestListToExcel`.

## 2. Purchase request query handler and repository

- [x] 2.1 In `src/modules/manage/application/queries/purchaseRequest/handler/get-all-for-export.command.query.ts`, populate `status` from the entity's workflow status field (e.g. `entity.status` or `entity.document?.status`) as a string, and `createdBy` from the creator user's username. Default both to `''` when missing.
- [x] 2.2 If the read repository's `findAllForExport` does not already select / join the creator user and the status field, update `IReadPurchaseRequestRepository`'s implementation to load them on the read connection. Keep selections minimal. (Resolved by adding `documents.status` to the shared `selectDocuments` constant in `src/common/constants/select-field.ts` and wiring it through `document.mapper.ts → setStatus`. The requester user is already joined via the existing `documents.users` relation, and per agreement `Created By = Username`, so no extra creator join is required.)

## 3. Purchase order query handler and repository

- [x] 3.1 In `src/modules/manage/application/queries/purchaseOrder/handler/get-all-for-export.command.query.ts`, populate `status` and `createdBy` for each row, defaulting to `''` when missing.
- [x] 3.2 If `IReadPurchaseOrderRepository.findAllForExport` does not already select / join the creator user and the status field, extend it to load them on the read connection. (Same resolution as 2.2 — handled centrally in `selectDocuments` + `document.mapper.ts`.)

## 4. Receipt query handler and repository

- [x] 4.1 In `src/modules/manage/application/queries/receipt/handler/get-all-for-export.command.query.ts`, populate `status` and `createdBy` for each row, defaulting to `''` when missing.
- [x] 4.2 If `IReadReceiptRepository.findAllForExport` does not already select / join the creator user and the status field, extend it to load them on the read connection. (Same resolution as 2.2.)

## 5. Verification

- [x] 5.1 Run `pnpm run lint` and `pnpm run build` to confirm there are no type errors after the row-interface field reorder. (`pnpm run build` passes. `pnpm run lint` reports 89 pre-existing errors in unrelated files — none in `excel-export.service.ts`, `select-field.ts`, `document.mapper.ts`, or any of the three `get-all-for-export.command.query.ts` handlers.)
- [ ] 5.2 Manually exercise each endpoint in dev (`pnpm run start:dev`) for a known date range — *requires a running DB; deferred to user verification*:
  - `GET /api/purchase-requests/export-excel?startDate=...&endDate=...`
  - `GET /api/purchase-orders/export-excel?startDate=...&endDate=...`
  - `GET /api/receipts/export-excel?startDate=...&endDate=...`
  Open each `.xlsx` and verify column order, that `Status` and `Created By` are populated, and that PO / Receipt sheets show a working `Sum Total` formula at the bottom.
- [ ] 5.3 Verify the empty-range case for PO and Receipt: the worksheet ends at the header row with no `Sum Total` row appended. *Deferred to user verification.*
