## Why

The current PR / PO / Receipt list-export Excel files only show a document number, the requester username and a created-at timestamp (plus a total for PO and Receipt). Users reviewing exported reports cannot tell the workflow status of each row, who created the document, or the total spend in a date range without re-tallying by hand. The column order also buries the most useful identifiers behind the timestamp, which slows down scanning. We need to enrich the three exports so they are usable as standalone reports.

## What Changes

- Add a `Status` column to all three list exports (PR / PO / Receipt) showing the current document status.
- Add a `Created By` column to all three list exports (the user who created the document, distinct from the requester `Username`).
- Reorder columns so the leading identifiers come before the timestamp. New order:
  1. Document number (`PR Number` / `PO Number` / `Receipt Number`)
  2. `Username` (requester)
  3. `Status`
  4. `Created By`
  5. `Created At`
  6. `Total` (PO and Receipt only)
- Add a `Sum Total` summary row at the bottom of the PO and Receipt sheets that totals the `Total` column. (PR has no monetary total, so no summary row is added there.)
- Extend the export row interfaces (`PrListExportRow`, `PoListExportRow`, `ReceiptListExportRow`) and their query handlers / repositories so that `status` and `createdBy` are populated.

No API surface (routes, query parameters, response codes) changes — only the contents and shape of the generated `.xlsx` file.

## Capabilities

### New Capabilities

- `pr-list-excel-export`: Excel list export for purchase requests within a date range, including identifier, requester, status, creator and timestamp columns.
- `po-list-excel-export`: Excel list export for purchase orders within a date range, including identifier, requester, status, creator, timestamp, total, and a sum-total summary row.
- `receipt-list-excel-export`: Excel list export for receipts within a date range, including identifier, requester, status, creator, timestamp, total, and a sum-total summary row.

### Modified Capabilities

<!-- None: there are no existing specs in openspec/specs/ for these exports yet. -->

## Impact

- **Code**:
  - `src/common/utils/excel-export.service.ts` — extend row interfaces, update `exportPurchaseRequestListToExcel`, `exportPurchaseOrderListToExcel`, `exportReceiptListToExcel` (column definitions, row mapping, sum-total row).
  - `src/modules/manage/application/queries/purchaseRequest/handler/get-all-for-export.command.query.ts`
  - `src/modules/manage/application/queries/purchaseOrder/handler/get-all-for-export.command.query.ts`
  - `src/modules/manage/application/queries/receipt/handler/get-all-for-export.command.query.ts`
  - The matching read-repository `findAllForExport` methods, if `status` / `createdBy` are not already loaded.
- **Controllers** (`purchase-request.controller.ts`, `purchase-order.controller.ts`, `receipt.controller.ts`): no signature changes; they continue calling the same export service methods.
- **External consumers**: clients that parse the exported `.xlsx` by column index will need to update — the column order changes and two new columns are added.
- **Dependencies**: no new packages.
