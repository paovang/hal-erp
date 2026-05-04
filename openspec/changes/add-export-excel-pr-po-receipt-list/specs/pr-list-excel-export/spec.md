## ADDED Requirements

### Requirement: Bulk Excel export endpoint for Purchase Requests
The system SHALL expose `GET /purchase-requests/export-excel` that returns a single `.xlsx` workbook containing every Purchase Request the caller is authorised to see whose `created_at` falls within `[startDate, endDate]`.

The endpoint MUST:
- Require JWT authentication (same guards as `GET /purchase-requests`).
- Accept the same query parameters as the existing PR `findAll` DTO (`search`, `department_id`, `company_id`, `status_id`, `type`), plus mandatory `startDate` and `endDate` (ISO 8601 dates).
- Reject the request when `startDate` or `endDate` is missing or `endDate` is earlier than `startDate`.
- Apply role-based scoping identically to `findAll`: SUPER_ADMIN/ADMIN see all rows; COMPANY_ADMIN/COMPANY_USER are scoped to their own `company_id`; department users are scoped to their department or to PRs where they are an approver.
- Bypass pagination — every matching row is written to the workbook.
- Return `Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` with `Content-Disposition: attachment; filename*=UTF-8''<encoded-name>` and `Content-Length` set to the buffer length.

#### Scenario: Successful export for an admin
- **WHEN** a SUPER_ADMIN calls `GET /purchase-requests/export-excel?startDate=2026-04-01&endDate=2026-04-30`
- **THEN** the response status is 200, the body is an `.xlsx` workbook, and the workbook contains one row per PR created in April 2026 across all companies

#### Scenario: Company-scoped export for a company user
- **WHEN** a COMPANY_USER from company A calls the endpoint with a valid date range
- **THEN** the workbook only contains PRs whose `documents.company_id` equals company A, even if the request includes `company_id=<companyB>`

#### Scenario: Missing date range is rejected
- **WHEN** a caller omits `startDate` or `endDate`
- **THEN** the response is a 400 validation error explaining that both fields are required

#### Scenario: Inverted date range is rejected
- **WHEN** the caller submits `startDate=2026-05-01&endDate=2026-04-01`
- **THEN** the response is a 400 validation error

### Requirement: Purchase Request workbook column layout
The exported workbook SHALL contain exactly three columns in this order: `pr_number`, `createdAt`, `requester.username`. The first row MUST be a header row labelling each column. Subsequent rows MUST contain one PR per row.

#### Scenario: Header row labels
- **WHEN** the workbook is generated
- **THEN** row 1 contains the header labels `PR Number`, `Created At`, `Requester` (in that order)

#### Scenario: Row content for a PR with a known requester
- **WHEN** a PR has `pr_number = "PR-2026-0001"`, `created_at = 2026-04-15T10:00:00`, and `document.users.username = "alice"`
- **THEN** the corresponding row contains `PR-2026-0001`, the formatted timestamp `2026-04-15 10:00:00` (Asia/Vientiane), and `alice`

#### Scenario: Row content when the requester is missing
- **WHEN** a PR has no associated `document.users` record
- **THEN** the `requester.username` cell is rendered as an empty string and the row is still emitted

### Requirement: Filter parity with `findAll`
For any combination of filter inputs accepted by both endpoints, the set of PR IDs produced by the export endpoint MUST equal the set of PR IDs produced by `GET /purchase-requests` (paginated across all pages) for the same caller.

#### Scenario: Same caller, same filters, identical row set
- **WHEN** a user calls `GET /purchase-requests?...filters...&startDate=X&endDate=Y` paginating across all pages, and then `GET /purchase-requests/export-excel?...filters...&startDate=X&endDate=Y`
- **THEN** the set of `pr_number` values in the workbook equals the set of `pr_number` values returned by the paginated list
