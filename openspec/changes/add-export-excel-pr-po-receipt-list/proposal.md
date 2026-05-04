## Why

Today users can only export a single Purchase Request, Purchase Order, or Receipt at a time (via `GET /…/export/:id`). To produce period-based reports (monthly, quarterly), staff must download records one-by-one and assemble them manually in Excel — which is slow, error-prone, and inconsistent with how the existing `findAll` listings are already filtered (by company, role, department, status, date range). This change adds list-level Excel exports so users can produce a single workbook covering an arbitrary date range, scoped automatically by the same rules already enforced on the matching list endpoints.

## What Changes

- Add three new bulk-export endpoints that return a single `.xlsx` file:
  - `GET /purchase-requests/export-excel?startDate&endDate&...`
  - `GET /purchase-orders/export-excel?startDate&endDate&...`
  - `GET /receipts/export-excel?startDate&endDate&...`
- Reuse the existing query DTOs and read-repository `findAll` logic so the same filters and the same role-based scoping (SUPER_ADMIN/ADMIN see all; COMPANY_ADMIN/COMPANY_USER scoped by `company_id`; department users scoped by department/approver) apply to the export. `startDate`/`endDate` are required for the export endpoints; pagination is bypassed (all matching rows are written).
- Define the workbook layout per entity:
  - **PR**: `pr_number`, `createdAt`, `requester.username`
  - **PO**: `po_number`, `createdAt`, `requester.username`, `total`
  - **Receipt**: `receipt_number`, `createdAt`, `requester.username`, `total`
- Extend `ExcelExportService` (`src/common/utils/excel-export.service.ts`) with three list-export methods (`exportPurchaseRequestListToExcel`, `exportPurchaseOrderListToExcel`, `exportReceiptListToExcel`) that emit one row per record using the shared font/styling already in use for single-record exports.
- Wire the new endpoints through CQRS query handlers (no commands, read-only) using the existing read database connection.

## Capabilities

### New Capabilities
- `pr-list-excel-export`: Bulk Excel export of Purchase Requests filtered by date range and the same scoping/filters as the PR list endpoint.
- `po-list-excel-export`: Bulk Excel export of Purchase Orders filtered by date range and the same scoping/filters as the PO list endpoint.
- `receipt-list-excel-export`: Bulk Excel export of Receipts filtered by date range and the same scoping/filters as the Receipt list endpoint.

### Modified Capabilities
<!-- None — the existing single-record export endpoints (`/…/export/:id`) and the `findAll` list endpoints are not changing. New endpoints are additive. -->

## Impact

- **Affected modules**: `src/modules/manage/` — controllers, application/queries, application/dto/query, application/providers for `purchaseRequest`, `purchaseOrder`, `receipt`.
- **Affected shared code**: `src/common/utils/excel-export.service.ts` (new list-export methods, no change to existing single-record methods).
- **APIs**: Three new authenticated `GET` endpoints under existing controllers. JWT + company-context guards reused. Response is `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` with `Content-Disposition: attachment`.
- **Database**: Read-only; uses the existing read connection. No schema changes, no migrations.
- **Dependencies**: No new packages — `exceljs` is already a dependency.
- **Performance**: Bulk export bypasses pagination, so the read repository must run the existing filter query without `limit/offset` and stream rows into the workbook. A required `startDate`/`endDate` window keeps row counts bounded.
- **Out of scope**: Changing column sets for the existing single-record exports; PDF or CSV output; scheduled/async generation; emailing the workbook.
