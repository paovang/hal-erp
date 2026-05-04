## Context

The codebase already has a single-record Excel export pattern wired through three controllers (`purchase-request.controller.ts`, `purchase-order.controller.ts`, `receipt.controller.ts`) and a shared `ExcelExportService` at [src/common/utils/excel-export.service.ts](src/common/utils/excel-export.service.ts). Each list endpoint (`findAll`) is implemented as a CQRS query handler whose read repository builds a TypeORM query with a layered set of filters: search, `department_id`, `company_id`, `status_id`, `startDate`/`endDate`, plus role-based scoping (SUPER_ADMIN/ADMIN, COMPANY_ADMIN/COMPANY_USER, department-level approver users).

The new export-list feature must reuse those filters verbatim — diverging would create an audit gap where the export shows different rows than the user sees on screen. Pagination, however, must be bypassed: the export should contain every row that matches the filter window.

## Goals / Non-Goals

**Goals:**
- Three new endpoints (`GET /purchase-requests/export-excel`, `/purchase-orders/export-excel`, `/receipts/export-excel`) that produce a single `.xlsx` over a `[startDate, endDate]` window with the same filters and role-based scoping as the corresponding `findAll`.
- Column layouts:
  - PR: `pr_number`, `createdAt`, `requester.username`
  - PO: `po_number`, `createdAt`, `requester.username`, `total`
  - Receipt: `receipt_number`, `createdAt`, `requester.username`, `total`
- One unified place (`ExcelExportService`) for list-export rendering so the styling matches existing single-record exports (Phetsarath OT font, header banding, borders).
- Role-based scoping enforced in the read repository — never trust client-supplied `company_id` for non-admin users.

**Non-Goals:**
- Changing the existing `/…/export/:id` single-record endpoints or their column sets.
- Adding new filters that don't already exist on the matching `findAll` DTO.
- Async/queued generation, email delivery, scheduled reports, CSV/PDF output.
- Streaming responses — the workbook is generated fully in memory (acceptable given the bounded date window; see Risks).

## Decisions

### 1. Reuse `findAll` filtering by adding a `findAllForExport` method on each read repository (no pagination)
**Decision:** In each of `read.repository.ts` (PR, PO, Receipt), extract the existing where-clause / role-scoping logic into a private builder, then add a public `findAllForExport(filter, authUser)` that uses the same builder but skips `take`/`skip`. The `findAll` flow is unchanged.

**Why:** Forking the filter logic into the controller or a new service would let the two paths drift. Centralising in the repo keeps the single source of truth.

**Alternatives considered:**
- *Call the existing `findAll` with a huge `pageSize`* — works mechanically but couples the export to whatever pagination contract `findAll` uses, and produces an unnecessary `count(*)` round trip.
- *New, separate repository* — duplicates the role-scoping logic, which is the part most likely to drift.

### 2. New CQRS query per entity, not a controller-only call
**Decision:** Add `GetAllPurchaseRequestForExportQuery` / `GetAllPurchaseOrderForExportQuery` / `GetAllReceiptForExportQuery` and matching handlers under `application/queries/<entity>/`. Controllers call `QueryBus.execute(...)`, then hand results to `ExcelExportService`.

**Why:** Matches the project-wide pattern (controllers never reach into repos directly; everything goes through CQRS). Keeps the new endpoint shape consistent with existing list/get endpoints and makes it trivially testable via mocked handlers.

**Alternatives considered:** Direct service call. Rejected — the project's CLAUDE.md mandates CQRS for read paths.

### 3. Column field resolution via mappers, not raw entities
**Decision:** Add a small response-shape helper (or lean on existing response mappers) so the export service receives plain `{ pr_number, createdAt, requesterUsername, total? }` rows — not domain entities. The "requester username" is resolved by the read repository's existing join chain (`document.users` for PR/PO; `received_by` user lookup for Receipt) and flattened in the mapper.

**Why:** Keeps `ExcelExportService` ignorant of TypeORM internals and makes the per-entity export methods narrow and obviously correct (`row.eachCell` over a typed shape).

**Alternatives considered:** Pass the domain entity directly. Rejected — `ExcelExportService` would need to know about every entity's relation graph, and the requester lookup differs between PR/PO (via `document.users`) and Receipt (via `received_by`).

### 4. `startDate`/`endDate` are required for the export endpoints
**Decision:** Mark `startDate` and `endDate` as required in the export DTOs (override the optional declaration on the existing list DTOs) and validate `endDate >= startDate`. Also enforce a maximum window (e.g., 366 days) to bound row count.

**Why:** Without a required window, a user could trigger a full-table dump. The list `findAll` is paginated, so it tolerates missing dates; the export is not.

**Alternatives considered:** Default to "last 30 days" when missing. Rejected — silent defaults make audit/compliance reporting ambiguous; explicit is safer.

### 5. Column set is fixed per entity, not user-selectable
**Decision:** The three column sets are hardcoded per the user request. No client-side column selection in this change.

**Why:** Matches the brief and avoids designing a column-projection API now. Easy to extend later by accepting a `columns` query param.

### 6. Filename convention reuses `ExcelExportService.generateFileName`
**Decision:** Filenames follow the existing pattern `${prefix}_list_${YYYYMMDD}-${YYYYMMDD}.xlsx` (e.g., `PR_list_20260101-20260131.xlsx`). Use the existing `generateFileName` helper, extending it minimally if needed.

**Why:** Operational consistency with single-record exports.

## Risks / Trade-offs

- **Unbounded memory if the date window is large** → Mitigation: enforce required `startDate`/`endDate` and a maximum window length validated in the DTO. If row count grows beyond the bound (e.g., > ~50k rows for receipts), revisit with `exceljs` streaming writer in a follow-up.
- **Role-scoping drift between `findAll` and export** → Mitigation: extract the where-clause builder into a single private method on each read repository so both `findAll` and `findAllForExport` consume it. Add a unit test per repo asserting the same WHERE SQL is produced for the same filter input.
- **Requester username may be null** (legacy rows where `document.users` is missing) → Mitigation: render an empty cell rather than failing the export; covered by a scenario in the spec.
- **Receipt totals are stored per-currency** (`_currency_totals`) while the spec says "total" — there is also a top-level `_total` field on the receipt entity. → Mitigation: write `_total` (in LAK, matching the in-flight `convert-receipt-total-to-lak` change). Confirm with the user during apply if the existing total field is the right column for the multi-currency case.
- **Double work on each request** (build query, fetch, then render) — synchronous endpoint may be slow for large windows → Mitigation: bounded window mitigates this for now; if needed, follow up with async/queued generation.

## Migration Plan

This is additive — no schema changes, no data migration, no breaking changes to existing endpoints. Deploy is a normal release. Rollback is reverting the commit; the new endpoints simply disappear and existing functionality is unaffected.

## Open Questions

- For the Receipt export, is the column `total` meant to be the LAK-converted `_total` field (now that `convert-receipt-total-to-lak` is in progress) or the original currency-tagged total? Default in this design: use `_total` and confirm during implementation.
- Should non-admin users be allowed to override `company_id` in the query string, or always be forced to their own company? Default in this design: force own company (matches existing `findAll` behavior).
