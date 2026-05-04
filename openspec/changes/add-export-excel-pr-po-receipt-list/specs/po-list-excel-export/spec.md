## ADDED Requirements

### Requirement: Bulk Excel export endpoint for Purchase Orders
The system SHALL expose `GET /purchase-orders/export-excel` that returns a single `.xlsx` workbook containing every Purchase Order the caller is authorised to see whose `created_at` falls within `[startDate, endDate]`.

The endpoint MUST:
- Require JWT authentication (same guards as `GET /purchase-orders`).
- Accept the same query parameters as the existing PO `findAll` DTO (`search`, `department_id`, `company_id`, `order_date`, `type`), plus mandatory `startDate` and `endDate` (ISO 8601 dates).
- Reject the request when `startDate` or `endDate` is missing or `endDate` is earlier than `startDate`.
- Apply role-based scoping identically to `findAll`: SUPER_ADMIN/ADMIN see all rows; COMPANY_ADMIN/COMPANY_USER are scoped to their own `company_id`; department users are scoped to their department or to POs where they are an approver.
- Bypass pagination — every matching row is written to the workbook.
- Return `Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` with `Content-Disposition: attachment; filename*=UTF-8''<encoded-name>` and `Content-Length` set to the buffer length.

#### Scenario: Successful export for an admin
- **WHEN** a SUPER_ADMIN calls `GET /purchase-orders/export-excel?startDate=2026-04-01&endDate=2026-04-30`
- **THEN** the response status is 200, the body is an `.xlsx` workbook, and the workbook contains one row per PO created in April 2026 across all companies

#### Scenario: Company-scoped export for a company user
- **WHEN** a COMPANY_USER from company A calls the endpoint with a valid date range
- **THEN** the workbook only contains POs whose `documents.company_id` equals company A, even if the request includes `company_id=<companyB>`

#### Scenario: Missing date range is rejected
- **WHEN** a caller omits `startDate` or `endDate`
- **THEN** the response is a 400 validation error explaining that both fields are required

#### Scenario: Inverted date range is rejected
- **WHEN** the caller submits `startDate=2026-05-01&endDate=2026-04-01`
- **THEN** the response is a 400 validation error

### Requirement: Purchase Order workbook column layout
The exported workbook SHALL contain exactly four columns in this order: `po_number`, `createdAt`, `requester.username`, `total`. The first row MUST be a header row labelling each column. Subsequent rows MUST contain one PO per row.

#### Scenario: Header row labels
- **WHEN** the workbook is generated
- **THEN** row 1 contains the header labels `PO Number`, `Created At`, `Requester`, `Total` (in that order)

#### Scenario: Row content for a PO with a known requester and total
- **WHEN** a PO has `po_number = "PO-2026-0001"`, `created_at = 2026-04-15T10:00:00`, `document.users.username = "alice"`, and `total = 1500000`
- **THEN** the corresponding row contains `PO-2026-0001`, the formatted timestamp `2026-04-15 10:00:00` (Asia/Vientiane), `alice`, and the numeric value `1500000` formatted with thousands separators

#### Scenario: Row content when the requester is missing
- **WHEN** a PO has no associated `document.users` record
- **THEN** the `requester.username` cell is rendered as an empty string and the row is still emitted

#### Scenario: Total cell is numeric, not string
- **WHEN** any PO row is rendered
- **THEN** the `total` cell holds a numeric value usable in Excel formulas (not a pre-formatted string), with display formatting applied at the cell-style level

### Requirement: Filter parity with `findAll`
For any combination of filter inputs accepted by both endpoints, the set of PO IDs produced by the export endpoint MUST equal the set of PO IDs produced by `GET /purchase-orders` (paginated across all pages) for the same caller.

#### Scenario: Same caller, same filters, identical row set
- **WHEN** a user calls `GET /purchase-orders?...filters...&startDate=X&endDate=Y` paginating across all pages, and then `GET /purchase-orders/export-excel?...filters...&startDate=X&endDate=Y`
- **THEN** the set of `po_number` values in the workbook equals the set of `po_number` values returned by the paginated list
